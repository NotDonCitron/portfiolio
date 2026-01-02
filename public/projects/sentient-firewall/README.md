# Sentient Firewall - AI-Powered Threat Detection

A demonstration of a machine learning-based firewall that detects and blocks malicious traffic patterns in real-time.

## Architecture

- **Backend**: Python (Flask, PyTorch, Scapy)
  - `firewall.py`: Core logic for packet analysis and threat detection.
  - `api.py`: REST API and WebSocket server for the dashboard.
- **Frontend**: HTML5, CSS3, JavaScript (Socket.IO)
  - Dashboard for real-time visualization of threats and traffic.

## Setup & Running

1. **Install Dependencies**:
   The backend requires Python 3.10+ and several libraries (Torch, Flask, etc.).

   ```bash
   cd backend
   python3 -m venv venv
   ./venv/bin/pip install -r requirements.txt
   ```

2. **Start the Backend**:
   Use the provided helper script:

   ```bash
   ./start.sh
   ```

   Or manually:

   ```bash
   cd backend
   ./venv/bin/python api.py
   ```

   The API will start on `http://localhost:5000`.

3. **Open the Dashboard**:
   Open `index.html` in your browser. It will automatically connect to the local backend.

## Features

- **Real-time Packet Analysis**: Simulates network traffic and analyzes it using a PyTorch model.
- **DDoS Detection**: Identifies flood patterns (SYN, UDP, HTTP).
- **Automated Blocking**: Adds `iptables` rules to drop malicious IPs (requires root on Linux, simulated otherwise).
- **Live Visualization**: Interactive threat map and neural network state visualization.

## Development

- `backend/firewall.py`: Threat detection logic and iptables management.
- `backend/api.py`: Web server and simulation engine.
- `script.js`: Frontend controller and WebSocket client.
