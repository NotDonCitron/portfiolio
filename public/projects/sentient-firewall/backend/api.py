#!/usr/bin/env python3
"""
Sentient Firewall - REST API Server

Provides a web API for the firewall dashboard and real-time updates
via WebSocket connections.

Author: Pascal Hintermaier
License: MIT
"""

import os
import sys
import json
import time
import random
import threading
from datetime import datetime
from typing import Dict, Any, List

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from loguru import logger

# Import firewall components
from firewall import (
    SentientFirewall,
    PacketFeatures,
    ThreatType,
    ThreatDetection,
    Config
)


# ============================================================================
# Flask App Setup
# ============================================================================

app = Flask(__name__)
CORS(app, origins=["*"])  # Allow all origins for demo
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# Global firewall instance
firewall: SentientFirewall = None
simulation_thread: threading.Thread = None
simulation_running = False


# ============================================================================
# API Routes
# ============================================================================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get current firewall statistics."""
    if firewall is None:
        return jsonify({"error": "Firewall not initialized"}), 503
    
    stats = firewall.get_stats()
    return jsonify(stats)


@app.route("/api/blocked-ips", methods=["GET"])
def get_blocked_ips():
    """Get list of blocked IP addresses."""
    if firewall is None:
        return jsonify({"error": "Firewall not initialized"}), 503
    
    blocked = firewall.iptables.get_blocked_ips()
    return jsonify({
        "count": len(blocked),
        "ips": blocked
    })


@app.route("/api/rules", methods=["GET"])
def get_rules():
    """Get active iptables rules."""
    if firewall is None:
        return jsonify({"error": "Firewall not initialized"}), 503
    
    rules = []
    for ip, block_time in firewall.iptables.blocked_ips.items():
        rules.append({
            "chain": "INPUT",
            "source": ip,
            "action": "DROP",
            "created": block_time.isoformat()
        })
    
    return jsonify({
        "chain": Config.CHAIN_NAME,
        "rules": rules
    })


@app.route("/api/start", methods=["POST"])
def start_firewall():
    """Start the firewall and packet simulation."""
    global firewall, simulation_running
    
    if firewall is None:
        firewall = SentientFirewall()
    
    if not firewall.running:
        firewall.start()
        simulation_running = True
        start_simulation()
        
    return jsonify({
        "status": "started",
        "timestamp": datetime.now().isoformat()
    })


@app.route("/api/stop", methods=["POST"])
def stop_firewall():
    """Stop the firewall."""
    global simulation_running
    
    if firewall is not None:
        firewall.stop()
        simulation_running = False
        
    return jsonify({
        "status": "stopped",
        "timestamp": datetime.now().isoformat()
    })


@app.route("/api/simulate/ddos", methods=["POST"])
def simulate_ddos():
    """Trigger a simulated DDoS attack."""
    if firewall is None or not firewall.running:
        return jsonify({"error": "Firewall not running"}), 400
    
    # Get attack parameters from request
    data = request.get_json() or {}
    duration = data.get("duration", 10)  # seconds
    intensity = data.get("intensity", 100)  # packets per second
    
    # Start DDoS simulation in background
    thread = threading.Thread(
        target=simulate_ddos_attack,
        args=(duration, intensity)
    )
    thread.daemon = True
    thread.start()
    
    return jsonify({
        "status": "ddos_simulation_started",
        "duration": duration,
        "intensity": intensity
    })


@app.route("/api/unblock/<ip>", methods=["DELETE"])
def unblock_ip(ip: str):
    """Manually unblock an IP address."""
    if firewall is None:
        return jsonify({"error": "Firewall not initialized"}), 503
    
    success = firewall.iptables.unblock_ip(ip)
    
    if success:
        return jsonify({
            "status": "unblocked",
            "ip": ip
        })
    else:
        return jsonify({
            "error": "IP not found in blocklist"
        }), 404


# ============================================================================
# WebSocket Events
# ============================================================================

@socketio.on("connect")
def handle_connect():
    """Handle new WebSocket connection."""
    logger.info(f"Client connected: {request.sid}")
    emit("connected", {
        "message": "Connected to Sentient Firewall",
        "timestamp": datetime.now().isoformat()
    })


@socketio.on("disconnect")
def handle_disconnect():
    """Handle WebSocket disconnection."""
    logger.info(f"Client disconnected: {request.sid}")


@socketio.on("subscribe")
def handle_subscribe(data):
    """Subscribe to real-time updates."""
    channel = data.get("channel", "all")
    logger.info(f"Client {request.sid} subscribed to {channel}")
    emit("subscribed", {"channel": channel})


# ============================================================================
# Simulation Logic
# ============================================================================

def start_simulation():
    """Start the packet simulation thread."""
    global simulation_thread
    
    if simulation_thread is not None and simulation_thread.is_alive():
        return
    
    simulation_thread = threading.Thread(target=simulation_loop)
    simulation_thread.daemon = True
    simulation_thread.start()


def simulation_loop():
    """Main simulation loop - generates fake network traffic."""
    global simulation_running
    
    country_codes = ["CN", "RU", "BR", "US", "DE", "FR", "IN", "KR", "JP", "AU", "GB", "NL"]
    
    while simulation_running and firewall and firewall.running:
        try:
            # Generate random packet
            packet = generate_random_packet()
            
            # Process through firewall
            detection = firewall.process_packet(packet)
            
            if detection:
                # Emit event to all connected clients
                event_data = {
                    "timestamp": datetime.now().isoformat(),
                    "packet": {
                        "src_ip": packet.src_ip,
                        "dst_port": packet.dst_port,
                        "protocol": packet.protocol,
                        "size": packet.packet_size,
                    },
                    "detection": {
                        "is_threat": detection.is_threat,
                        "threat_type": detection.threat_type.name,
                        "confidence": detection.confidence,
                        "pattern": detection.pattern.value if detection.pattern else None,
                    },
                    "country": random.choice(country_codes),
                    "stats": firewall.get_stats()
                }
                
                socketio.emit("packet_processed", event_data)
            
            # Random delay between packets
            time.sleep(random.uniform(0.1, 0.5))
            
        except Exception as e:
            logger.error(f"Simulation error: {e}")
            time.sleep(1)


def generate_random_packet() -> PacketFeatures:
    """Generate a random packet for simulation."""
    protocols = ["TCP", "UDP", "ICMP"]
    flags_options = ["S", "SA", "A", "FA", "R", ""]
    
    # Generate IP
    first_octet = random.choice([1, 10, 45, 91, 103, 128, 172, 185, 192, 203])
    src_ip = f"{first_octet}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"
    
    # Common destination ports
    common_ports = [22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 8080, 8443]
    dst_port = random.choice(common_ports) if random.random() < 0.7 else random.randint(1024, 65535)
    
    return PacketFeatures(
        timestamp=time.time(),
        src_ip=src_ip,
        dst_ip="10.0.0.1",  # Our server
        src_port=random.randint(1024, 65535),
        dst_port=dst_port,
        protocol=random.choice(protocols),
        packet_size=random.randint(64, 1500),
        flags=random.choice(flags_options),
        payload_size=random.randint(0, 1400),
    )


def simulate_ddos_attack(duration: int, intensity: int):
    """Simulate a DDoS attack for testing."""
    global firewall
    
    if firewall is None or not firewall.running:
        return
    
    logger.warning(f"DDoS simulation started: {intensity} pps for {duration}s")
    
    # Emit attack start event
    socketio.emit("ddos_detected", {
        "status": "attack_started",
        "timestamp": datetime.now().isoformat(),
        "estimated_intensity": intensity
    })
    
    start_time = time.time()
    attacker_ip = f"45.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,254)}"
    
    while time.time() - start_time < duration and firewall.running:
        # Generate attack packets
        packet = PacketFeatures(
            timestamp=time.time(),
            src_ip=attacker_ip,
            dst_ip="10.0.0.1",
            src_port=random.randint(1024, 65535),
            dst_port=80,
            protocol="TCP",
            packet_size=64,  # Small packets for SYN flood
            flags="S",  # SYN flag
            payload_size=0,
        )
        
        detection = firewall.process_packet(packet)
        
        if detection and detection.is_threat:
            socketio.emit("threat_blocked", {
                "timestamp": datetime.now().isoformat(),
                "source_ip": detection.source_ip,
                "threat_type": detection.threat_type.name,
                "pattern": detection.pattern.value if detection.pattern else "DDoS Attack",
                "confidence": detection.confidence,
            })
        
        time.sleep(1 / intensity)
    
    # Emit attack end event
    socketio.emit("ddos_detected", {
        "status": "attack_mitigated",
        "timestamp": datetime.now().isoformat(),
        "duration": duration,
        "blocked_count": firewall.stats["threats_blocked"]
    })
    
    logger.info("DDoS simulation ended")


# ============================================================================
# Main Entry Point
# ============================================================================

def main():
    """Start the API server."""
    global firewall
    
    # Configure logging
    logger.remove()
    logger.add(
        sys.stderr,
        level="DEBUG",
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>"
    )
    
    # Initialize firewall
    firewall = SentientFirewall()
    
    # Get port from environment or use default
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    logger.info(f"Starting Sentient Firewall API on {host}:{port}")
    
    # Run with SocketIO
    socketio.run(app, host=host, port=port, debug=True)


if __name__ == "__main__":
    main()