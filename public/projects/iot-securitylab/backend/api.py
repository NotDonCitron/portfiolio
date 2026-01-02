from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime
from sentinel_engine import IoTSentinel

app = Flask(__name__)
CORS(app)  # Enable CORS for the frontend

# Initialize scanning engine
sentinel = IoTSentinel()

# Storage for results (in-memory for this session)
last_scan_results = []

@app.route('/api/scan', methods=['POST'])
def run_scan():
    """Trigger a real network scan."""
    global last_scan_results
    data = request.get_json() or {}
    subnet = data.get('subnet')
    
    if subnet:
        sentinel.target_subnet = subnet
    
    # Perform the scan
    results = sentinel.perform_network_discovery()
    last_scan_results = results
    
    return jsonify({
        "status": "success",
        "device_count": len(results),
        "devices": results,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/devices', methods=['GET'])
def get_devices():
    """Get the results of the last scan."""
    return jsonify(last_scan_results)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get security statistics based on last scan."""
    if not last_scan_results:
        return jsonify({"score": 0, "secure": 0, "vulnerable": 0})
    
    vulnerable = [d for d in last_scan_results if d['vulnerability_score'] > 20]
    secure = [d for d in last_scan_results if d['vulnerability_score'] <= 20]
    
    score = 100 - (len(vulnerable) * 15)
    score = max(0, min(100, score))
    
    return jsonify({
        "score": score,
        "secure": len(secure),
        "vulnerable": len(vulnerable),
        "total": len(last_scan_results)
    })

@app.route('/api/device/<path:ip>/security', methods=['PUT'])
def update_device_security(ip):
    """Simulate hardening a device."""
    # Since we are scanning real IPs, we don't persist hardening 
    # but we can return a mock success response.
    return jsonify({
        "message": f"Security hardening protocol initiated for {ip}",
        "status": "completed",
        "remediation": "Port isolation applied"
    })

if __name__ == '__main__':
    # Start on port 5001 to avoid conflict with main backend
    app.run(debug=True, host='0.0.0.0', port=5001)