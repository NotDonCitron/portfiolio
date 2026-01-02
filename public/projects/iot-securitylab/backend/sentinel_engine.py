import socket
import threading
from concurrent.futures import ThreadPoolExecutor
import time
import subprocess
import os

class IoTSentinel:
    def __init__(self, target_subnet=None):
        self.target_subnet = target_subnet or self.get_local_subnet()
        self.discovered_devices = []
        self.is_scanning = False
        
        # Common IoT Ports and their associated services
        self.iot_ports = {
            1883: "MQTT (Message Broker)",
            5683: "CoAP (Constrained Application Protocol)",
            80: "HTTP (Web Management)",
            443: "HTTPS (Secure Web Management)",
            8000: "Generic IoT/Camera Service",
            8080: "Generic Web Console",
            554: "RTSP (Real-time Streaming Protocol)",
            1900: "UPnP (Discovery)",
            5353: "mDNS (Avahi/Bonjour)",
            8883: "MQTT over TLS",
        }

    def get_local_subnet(self):
        """Estimate the local /24 subnet based on the primary interface IP."""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            prefix = ".".join(local_ip.split(".")[:-1])
            return prefix
        except Exception:
            return "192.168.1"

    def scan_port(self, ip, port):
        """Attempts to connect to a specific port on an IP."""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            result = sock.connect_ex((ip, port))
            if result == 0:
                service = self.iot_ports.get(port, "Unknown")
                return {"port": port, "service": service, "status": "OPEN"}
            sock.close()
        except:
            pass
        return None

    def scan_device(self, ip):
        """Scans an IP for all defined IoT ports."""
        open_ports = []
        for port in self.iot_ports.keys():
            res = self.scan_port(ip, port)
            if res:
                open_ports.append(res)
        
        if open_ports:
            # Try to get hostname
            try:
                hostname = socket.gethostbyaddr(ip)[0]
            except:
                hostname = "Unknown Device"
                
            return {
                "ip": ip,
                "hostname": hostname,
                "services": open_ports,
                "vulnerability_score": len(open_ports) * 10,  # Proxy score
                "last_scan": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
        return None

    def perform_network_discovery(self, progress_callback=None):
        """Scans the entire /24 subnet for active devices with open IoT ports."""
        self.is_scanning = True
        self.discovered_devices = []
        prefix = self.target_subnet
        
        ips_to_scan = [f"{prefix}.{i}" for i in range(1, 255)]
        
        with ThreadPoolExecutor(max_workers=50) as executor:
            future_to_ip = {executor.submit(self.scan_device, ip): ip for ip in ips_to_scan}
            
            for future in future_to_ip:
                device = future.result()
                if device:
                    self.discovered_devices.append(device)
                
                if progress_callback:
                    progress_callback(len(self.discovered_devices))
                    
        self.is_scanning = False
        return self.discovered_devices

# Standalone Test
if __name__ == "__main__":
    sentinel = IoTSentinel()
    print(f"[*] Starting IoT-Sentinel scan on subnet: {sentinel.target_subnet}.x")
    devices = sentinel.perform_network_discovery()
    print(f"[*] Found {len(devices)} device(s) with active IoT ports.")
    for d in devices:
        print(f" -> {d['ip']} ({d['hostname']}): {len(d['services'])} services found.")
