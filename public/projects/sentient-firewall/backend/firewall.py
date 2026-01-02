#!/usr/bin/env python3
"""
Sentient Firewall - AI-Powered Real-Time Threat Detection

This module implements a machine learning-based firewall that:
1. Captures network packets in real-time
2. Extracts features for ML classification
3. Detects DDoS, port scans, and brute force attacks
4. Dynamically updates iptables rules

Author: Pascal Hintermaier
License: MIT
"""

import os
import sys
import time
import json
import hashlib
import threading
import subprocess
from datetime import datetime, timedelta
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum

import numpy as np
import torch
import torch.nn as nn
from loguru import logger


# ============================================================================
# Configuration
# ============================================================================

class Config:
    """Firewall configuration settings."""
    
    # Detection thresholds
    DDOS_THRESHOLD_PPS = 1000  # Packets per second
    DDOS_THRESHOLD_BPS = 100_000_000  # Bytes per second (100 MB/s)
    PORTSCAN_THRESHOLD = 50  # Different ports in time window
    BRUTEFORCE_THRESHOLD = 10  # Failed auth attempts
    
    # Time windows (seconds)
    ANALYSIS_WINDOW = 10
    BLOCK_DURATION = 3600  # 1 hour
    
    # ML Model settings
    INPUT_FEATURES = 12
    HIDDEN_SIZE = 64
    NUM_CLASSES = 4  # Normal, DDoS, PortScan, BruteForce
    
    # iptables chain name
    CHAIN_NAME = "SENTIENT_FIREWALL"


# ============================================================================
# Enums & Data Classes
# ============================================================================

class ThreatType(Enum):
    """Types of threats the firewall can detect."""
    NORMAL = 0
    DDOS = 1
    PORTSCAN = 2
    BRUTEFORCE = 3


class AttackPattern(Enum):
    """Specific attack patterns."""
    SYN_FLOOD = "SYN Flood"
    UDP_FLOOD = "UDP Flood"
    ICMP_FLOOD = "ICMP Flood"
    HTTP_FLOOD = "HTTP Flood"
    SLOWLORIS = "Slowloris"
    TCP_SYN_SCAN = "TCP SYN Scan"
    TCP_FIN_SCAN = "TCP FIN Scan"
    XMAS_SCAN = "Xmas Scan"
    NULL_SCAN = "NULL Scan"
    SSH_BRUTEFORCE = "SSH Brute Force"
    FTP_BRUTEFORCE = "FTP Brute Force"
    HTTP_AUTH_BRUTEFORCE = "HTTP Auth Brute Force"


@dataclass
class PacketFeatures:
    """Extracted features from a network packet."""
    timestamp: float
    src_ip: str
    dst_ip: str
    src_port: int
    dst_port: int
    protocol: str
    packet_size: int
    flags: str = ""
    payload_size: int = 0
    
    def to_vector(self) -> np.ndarray:
        """Convert features to numpy array for ML model."""
        # Encode IP as hash (simplified)
        ip_hash = int(hashlib.md5(self.src_ip.encode()).hexdigest()[:8], 16) / (16**8)
        
        # Protocol encoding
        protocol_map = {"TCP": 0, "UDP": 1, "ICMP": 2}
        protocol_enc = protocol_map.get(self.protocol, 3) / 3
        
        # Flag encoding (TCP flags)
        flag_value = sum([
            0.1 if 'S' in self.flags else 0,  # SYN
            0.2 if 'A' in self.flags else 0,  # ACK
            0.1 if 'F' in self.flags else 0,  # FIN
            0.1 if 'R' in self.flags else 0,  # RST
            0.1 if 'P' in self.flags else 0,  # PSH
        ])
        
        return np.array([
            ip_hash,
            self.src_port / 65535,
            self.dst_port / 65535,
            protocol_enc,
            self.packet_size / 1500,
            self.payload_size / 1500,
            flag_value,
            0,  # Reserved for flow features
            0,
            0,
            0,
            0,
        ], dtype=np.float32)


@dataclass
class FlowStats:
    """Statistics for a network flow (per source IP)."""
    first_seen: float = field(default_factory=time.time)
    last_seen: float = field(default_factory=time.time)
    packet_count: int = 0
    byte_count: int = 0
    unique_dst_ports: set = field(default_factory=set)
    unique_dst_ips: set = field(default_factory=set)
    syn_count: int = 0
    failed_connections: int = 0
    
    def packets_per_second(self) -> float:
        """Calculate packets per second."""
        duration = self.last_seen - self.first_seen
        if duration <= 0:
            return self.packet_count
        return self.packet_count / duration
    
    def bytes_per_second(self) -> float:
        """Calculate bytes per second."""
        duration = self.last_seen - self.first_seen
        if duration <= 0:
            return self.byte_count
        return self.byte_count / duration


@dataclass
class ThreatDetection:
    """Result of threat detection analysis."""
    is_threat: bool
    threat_type: ThreatType
    confidence: float
    pattern: Optional[AttackPattern]
    source_ip: str
    details: Dict[str, Any] = field(default_factory=dict)


# ============================================================================
# Neural Network Model
# ============================================================================

class ThreatClassifier(nn.Module):
    """
    LSTM-based threat classifier for network traffic analysis.
    
    Architecture:
    - Input layer: Packet features
    - LSTM layer: Sequential pattern recognition
    - Dense layers: Classification
    - Output: Threat type probabilities
    """
    
    def __init__(self, input_size: int = Config.INPUT_FEATURES,
                 hidden_size: int = Config.HIDDEN_SIZE,
                 num_classes: int = Config.NUM_CLASSES):
        super().__init__()
        
        self.hidden_size = hidden_size
        
        # Feature extraction
        self.feature_net = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.BatchNorm1d(hidden_size),
            nn.Dropout(0.2),
        )
        
        # LSTM for sequential patterns
        self.lstm = nn.LSTM(
            input_size=hidden_size,
            hidden_size=hidden_size,
            num_layers=2,
            batch_first=True,
            dropout=0.2,
        )
        
        # Classification head
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_size // 2, num_classes),
        )
        
    def forward(self, x: torch.Tensor, 
                hidden: Optional[Tuple[torch.Tensor, torch.Tensor]] = None
                ) -> Tuple[torch.Tensor, Tuple[torch.Tensor, torch.Tensor]]:
        """
        Forward pass through the network.
        
        Args:
            x: Input tensor of shape (batch, seq_len, features)
            hidden: Optional LSTM hidden state
            
        Returns:
            output: Class probabilities
            hidden: Updated LSTM hidden state
        """
        batch_size, seq_len, _ = x.shape
        
        # Extract features
        x = x.view(-1, x.shape[-1])
        features = self.feature_net(x)
        features = features.view(batch_size, seq_len, -1)
        
        # LSTM processing
        if hidden is None:
            hidden = self._init_hidden(batch_size, x.device)
        
        lstm_out, hidden = self.lstm(features, hidden)
        
        # Use last LSTM output for classification
        last_output = lstm_out[:, -1, :]
        output = self.classifier(last_output)
        
        return torch.softmax(output, dim=-1), hidden
    
    def _init_hidden(self, batch_size: int, device: torch.device
                     ) -> Tuple[torch.Tensor, torch.Tensor]:
        """Initialize LSTM hidden state."""
        h0 = torch.zeros(2, batch_size, self.hidden_size, device=device)
        c0 = torch.zeros(2, batch_size, self.hidden_size, device=device)
        return (h0, c0)


# ============================================================================
# Flow Analyzer
# ============================================================================

class FlowAnalyzer:
    """Analyzes network flows and maintains per-IP statistics."""
    
    def __init__(self):
        self.flows: Dict[str, FlowStats] = defaultdict(FlowStats)
        self.lock = threading.Lock()
        
    def update(self, packet: PacketFeatures) -> FlowStats:
        """Update flow statistics with new packet."""
        with self.lock:
            flow = self.flows[packet.src_ip]
            flow.last_seen = packet.timestamp
            flow.packet_count += 1
            flow.byte_count += packet.packet_size
            flow.unique_dst_ports.add(packet.dst_port)
            flow.unique_dst_ips.add(packet.dst_ip)
            
            if 'S' in packet.flags and 'A' not in packet.flags:
                flow.syn_count += 1
                
            return flow
    
    def get_flow(self, src_ip: str) -> Optional[FlowStats]:
        """Get flow statistics for an IP."""
        return self.flows.get(src_ip)
    
    def cleanup_old_flows(self, max_age: float = Config.ANALYSIS_WINDOW * 6):
        """Remove old flow entries."""
        now = time.time()
        with self.lock:
            expired = [
                ip for ip, flow in self.flows.items()
                if now - flow.last_seen > max_age
            ]
            for ip in expired:
                del self.flows[ip]


# ============================================================================
# Threat Detector
# ============================================================================

class ThreatDetector:
    """
    Main threat detection engine combining rule-based and ML detection.
    """
    
    def __init__(self, model_path: Optional[str] = None):
        self.flow_analyzer = FlowAnalyzer()
        self.model = ThreatClassifier()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
        else:
            logger.warning("No model loaded - using rule-based detection only")
            
        self.model.eval()
        self.packet_buffer: Dict[str, List[PacketFeatures]] = defaultdict(list)
        self.buffer_lock = threading.Lock()
        
    def load_model(self, path: str):
        """Load pre-trained model weights."""
        try:
            self.model.load_state_dict(torch.load(path, map_location=self.device))
            logger.info(f"Model loaded from {path}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            
    def analyze_packet(self, packet: PacketFeatures) -> ThreatDetection:
        """
        Analyze a single packet for threats.
        
        Combines:
        1. Flow-based heuristics
        2. ML classification
        3. Pattern matching
        """
        # Update flow statistics
        flow = self.flow_analyzer.update(packet)
        
        # Add to packet buffer for ML analysis
        with self.buffer_lock:
            self.packet_buffer[packet.src_ip].append(packet)
            # Keep only recent packets
            cutoff = time.time() - Config.ANALYSIS_WINDOW
            self.packet_buffer[packet.src_ip] = [
                p for p in self.packet_buffer[packet.src_ip]
                if p.timestamp > cutoff
            ]
        
        # Rule-based detection
        rule_detection = self._rule_based_detection(packet, flow)
        if rule_detection.is_threat and rule_detection.confidence > 0.8:
            return rule_detection
        
        # ML-based detection
        ml_detection = self._ml_detection(packet.src_ip)
        
        # Combine results (prefer higher confidence)
        if ml_detection and ml_detection.confidence > rule_detection.confidence:
            return ml_detection
            
        return rule_detection
    
    def _rule_based_detection(self, packet: PacketFeatures, 
                               flow: FlowStats) -> ThreatDetection:
        """Apply rule-based heuristics for threat detection."""
        
        # Check for DDoS indicators
        pps = flow.packets_per_second()
        bps = flow.bytes_per_second()
        
        if pps > Config.DDOS_THRESHOLD_PPS:
            pattern = self._identify_ddos_pattern(packet, flow)
            return ThreatDetection(
                is_threat=True,
                threat_type=ThreatType.DDOS,
                confidence=min(0.95, 0.7 + (pps / Config.DDOS_THRESHOLD_PPS) * 0.1),
                pattern=pattern,
                source_ip=packet.src_ip,
                details={
                    "packets_per_second": pps,
                    "bytes_per_second": bps,
                }
            )
        
        # Check for port scanning
        if len(flow.unique_dst_ports) > Config.PORTSCAN_THRESHOLD:
            pattern = self._identify_scan_pattern(packet, flow)
            return ThreatDetection(
                is_threat=True,
                threat_type=ThreatType.PORTSCAN,
                confidence=min(0.92, 0.6 + len(flow.unique_dst_ports) / 100),
                pattern=pattern,
                source_ip=packet.src_ip,
                details={
                    "unique_ports": len(flow.unique_dst_ports),
                    "scan_rate": flow.packets_per_second(),
                }
            )
        
        # Check for brute force
        if flow.failed_connections > Config.BRUTEFORCE_THRESHOLD:
            pattern = self._identify_bruteforce_pattern(packet)
            return ThreatDetection(
                is_threat=True,
                threat_type=ThreatType.BRUTEFORCE,
                confidence=min(0.88, 0.5 + flow.failed_connections / 20),
                pattern=pattern,
                source_ip=packet.src_ip,
                details={
                    "failed_attempts": flow.failed_connections,
                }
            )
        
        # No threat detected
        return ThreatDetection(
            is_threat=False,
            threat_type=ThreatType.NORMAL,
            confidence=0.95,
            pattern=None,
            source_ip=packet.src_ip,
        )
    
    def _ml_detection(self, src_ip: str) -> Optional[ThreatDetection]:
        """Apply ML model for threat classification."""
        with self.buffer_lock:
            packets = self.packet_buffer.get(src_ip, [])
        
        if len(packets) < 5:
            return None
        
        try:
            # Prepare input tensor
            features = np.stack([p.to_vector() for p in packets[-32:]])
            x = torch.tensor(features, dtype=torch.float32).unsqueeze(0).to(self.device)
            
            # Run inference
            with torch.no_grad():
                probs, _ = self.model(x)
                probs = probs.cpu().numpy()[0]
            
            # Get prediction
            pred_class = int(np.argmax(probs))
            confidence = float(probs[pred_class])
            
            if pred_class == 0 or confidence < 0.6:
                return None
                
            threat_type = ThreatType(pred_class)
            
            return ThreatDetection(
                is_threat=True,
                threat_type=threat_type,
                confidence=confidence,
                pattern=None,  # ML doesn't identify specific pattern
                source_ip=src_ip,
                details={"ml_probabilities": probs.tolist()}
            )
            
        except Exception as e:
            logger.error(f"ML detection error: {e}")
            return None
    
    def _identify_ddos_pattern(self, packet: PacketFeatures, 
                                flow: FlowStats) -> AttackPattern:
        """Identify specific DDoS attack pattern."""
        if packet.protocol == "UDP":
            return AttackPattern.UDP_FLOOD
        elif packet.protocol == "ICMP":
            return AttackPattern.ICMP_FLOOD
        elif 'S' in packet.flags and flow.syn_count > 100:
            return AttackPattern.SYN_FLOOD
        else:
            return AttackPattern.HTTP_FLOOD
    
    def _identify_scan_pattern(self, packet: PacketFeatures,
                                flow: FlowStats) -> AttackPattern:
        """Identify specific port scan pattern."""
        if 'S' in packet.flags and 'A' not in packet.flags:
            return AttackPattern.TCP_SYN_SCAN
        elif 'F' in packet.flags:
            return AttackPattern.TCP_FIN_SCAN
        elif packet.flags == "":
            return AttackPattern.NULL_SCAN
        else:
            return AttackPattern.XMAS_SCAN
    
    def _identify_bruteforce_pattern(self, packet: PacketFeatures) -> AttackPattern:
        """Identify specific brute force pattern."""
        if packet.dst_port == 22:
            return AttackPattern.SSH_BRUTEFORCE
        elif packet.dst_port == 21:
            return AttackPattern.FTP_BRUTEFORCE
        else:
            return AttackPattern.HTTP_AUTH_BRUTEFORCE


# ============================================================================
# IPTables Manager
# ============================================================================

class IPTablesManager:
    """
    Manages iptables rules for blocking detected threats.
    
    Note: Requires root privileges on Linux.
    """
    
    def __init__(self):
        self.blocked_ips: Dict[str, datetime] = {}
        self.lock = threading.Lock()
        self._setup_chain()
        
    def _setup_chain(self):
        """Create custom iptables chain if it doesn't exist."""
        try:
            # Check if chain exists
            result = subprocess.run(
                ["iptables", "-L", Config.CHAIN_NAME],
                capture_output=True,
                text=True
            )
            
            if result.returncode != 0:
                # Create chain
                subprocess.run(
                    ["iptables", "-N", Config.CHAIN_NAME],
                    check=True
                )
                # Add chain to INPUT
                subprocess.run(
                    ["iptables", "-I", "INPUT", "-j", Config.CHAIN_NAME],
                    check=True
                )
                logger.info(f"Created iptables chain: {Config.CHAIN_NAME}")
                
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to setup iptables chain: {e}")
        except FileNotFoundError:
            logger.warning("iptables not found - running in simulation mode")
    
    def block_ip(self, ip: str, reason: str) -> bool:
        """
        Add DROP rule for an IP address.
        
        Args:
            ip: IP address to block
            reason: Reason for blocking (logged)
            
        Returns:
            True if rule was added successfully
        """
        with self.lock:
            if ip in self.blocked_ips:
                return False  # Already blocked
            
            try:
                subprocess.run(
                    ["iptables", "-A", Config.CHAIN_NAME, "-s", ip, "-j", "DROP"],
                    check=True,
                    capture_output=True
                )
                self.blocked_ips[ip] = datetime.now()
                logger.info(f"Blocked IP {ip}: {reason}")
                return True
                
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to block IP {ip}: {e}")
                return False
            except FileNotFoundError:
                # Simulation mode
                self.blocked_ips[ip] = datetime.now()
                logger.info(f"[SIM] Blocked IP {ip}: {reason}")
                return True
    
    def unblock_ip(self, ip: str) -> bool:
        """Remove DROP rule for an IP address."""
        with self.lock:
            if ip not in self.blocked_ips:
                return False
            
            try:
                subprocess.run(
                    ["iptables", "-D", Config.CHAIN_NAME, "-s", ip, "-j", "DROP"],
                    check=True,
                    capture_output=True
                )
                del self.blocked_ips[ip]
                logger.info(f"Unblocked IP {ip}")
                return True
                
            except subprocess.CalledProcessError as e:
                logger.error(f"Failed to unblock IP {ip}: {e}")
                return False
            except FileNotFoundError:
                del self.blocked_ips[ip]
                logger.info(f"[SIM] Unblocked IP {ip}")
                return True
    
    def cleanup_expired_blocks(self):
        """Remove blocks that have exceeded their duration."""
        now = datetime.now()
        expired = [
            ip for ip, block_time in self.blocked_ips.items()
            if (now - block_time).total_seconds() > Config.BLOCK_DURATION
        ]
        for ip in expired:
            self.unblock_ip(ip)
    
    def get_blocked_ips(self) -> List[Dict[str, Any]]:
        """Get list of currently blocked IPs."""
        with self.lock:
            return [
                {
                    "ip": ip,
                    "blocked_at": block_time.isoformat(),
                    "expires_at": (block_time + timedelta(seconds=Config.BLOCK_DURATION)).isoformat()
                }
                for ip, block_time in self.blocked_ips.items()
            ]


# ============================================================================
# Main Firewall Controller
# ============================================================================

class SentientFirewall:
    """
    Main firewall controller that orchestrates all components.
    """
    
    def __init__(self, model_path: Optional[str] = None):
        self.detector = ThreatDetector(model_path)
        self.iptables = IPTablesManager()
        self.running = False
        self.stats = {
            "packets_analyzed": 0,
            "threats_blocked": 0,
            "start_time": None,
        }
        
    def start(self):
        """Start the firewall."""
        self.running = True
        self.stats["start_time"] = datetime.now().isoformat()
        logger.info("Sentient Firewall started")
        
        # Start cleanup thread
        self._start_cleanup_thread()
        
    def stop(self):
        """Stop the firewall."""
        self.running = False
        logger.info("Sentient Firewall stopped")
        
    def process_packet(self, packet: PacketFeatures) -> Optional[ThreatDetection]:
        """
        Process a single packet through the detection pipeline.
        
        Returns:
            ThreatDetection if packet was analyzed, None if firewall is stopped
        """
        if not self.running:
            return None
            
        self.stats["packets_analyzed"] += 1
        
        # Analyze packet
        detection = self.detector.analyze_packet(packet)
        
        # Block if threat detected
        if detection.is_threat:
            self.stats["threats_blocked"] += 1
            reason = f"{detection.threat_type.name}"
            if detection.pattern:
                reason += f" - {detection.pattern.value}"
            self.iptables.block_ip(detection.source_ip, reason)
            
        return detection
    
    def get_stats(self) -> Dict[str, Any]:
        """Get current firewall statistics."""
        return {
            **self.stats,
            "blocked_ips": len(self.iptables.blocked_ips),
            "active_flows": len(self.detector.flow_analyzer.flows),
        }
    
    def _start_cleanup_thread(self):
        """Start background cleanup thread."""
        def cleanup_loop():
            while self.running:
                time.sleep(60)
                self.iptables.cleanup_expired_blocks()
                self.detector.flow_analyzer.cleanup_old_flows()
                
        thread = threading.Thread(target=cleanup_loop, daemon=True)
        thread.start()


# ============================================================================
# CLI Entry Point
# ============================================================================

def main():
    """Main entry point for CLI usage."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Sentient Firewall - AI-Powered Threat Detection"
    )
    parser.add_argument(
        "--model", "-m",
        help="Path to trained model weights",
        default=None
    )
    parser.add_argument(
        "--interface", "-i",
        help="Network interface to monitor",
        default="eth0"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose logging"
    )
    
    args = parser.parse_args()
    
    # Configure logging
    log_level = "DEBUG" if args.verbose else "INFO"
    logger.remove()
    logger.add(sys.stderr, level=log_level)
    
    # Initialize firewall
    firewall = SentientFirewall(model_path=args.model)
    firewall.start()
    
    logger.info(f"Monitoring interface: {args.interface}")
    logger.info("Press Ctrl+C to stop")
    
    try:
        # In a real implementation, this would capture packets
        # from the network interface using scapy or similar
        while firewall.running:
            time.sleep(1)
            stats = firewall.get_stats()
            logger.debug(f"Stats: {stats}")
            
    except KeyboardInterrupt:
        logger.info("Shutting down...")
        firewall.stop()


if __name__ == "__main__":
    main()