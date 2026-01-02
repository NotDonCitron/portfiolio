# Bar-OS: IoT-Sentinel v1.0.9

**IoT-Sentinel** is a high-performance network assessment framework designed to discover and audit IoT devices within a local subnet. Unlike static demos, IoT-Sentinel performs real-world port probes and service fingerprinting to identify potential security risks in your environment.

## 🚀 Key Features

- **Subnet Discovery**: Automatically identifies local IP ranges and performs horizontal network sweeps.
- **Service Fingerprinting**: Specialized detection for IoT-specific protocols (MQTT, CoAP, UPnP, RTSP).
- **Vulnerability Assessment**: Maps discovered services to potential threat vectors and security risks.
- **Neural UI (Bar-OS)**: Premium cybernetic monitoring console with live terminal feeds and node grids.
- **Attack Simulation**: Interactive module to simulate common IoT breaches like Brute Force and MITM.

## 🛠️ Technology Stack

- **Backend**: Python 3 // Flask // Socket-level scanning engine.
- **Frontend**: Vanilla JS // CSS Grid // Bar-OS Neural Core UI.
- **Frameworks**: Multithreaded `concurrent.futures` for high-speed packet distribution.

## 📦 Project Structure

```text
iot-securitylab/
├── index.html          # Bar-OS Sentinel Console
├── style.css           # Neural Design System
├── script.js           # Live Node Interface
└── backend/
    ├── sentinel_engine.py  # Core Functional Scanning Engine
    ├── api.py              # Flask REST Endpoint
    └── requirements.txt    # Python Dependencies
```

## ⚙️ Setup & Initiation

1. **Install Dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the Sentinel Backend**:

   ```bash
   python api.py
   ```

   *The backend will initialize at `http://localhost:5001`.*

3. **Access the Console**:
   Open `http://localhost:5173/projects/iot-securitylab/index.html` in your browser.

## 🛡️ Security Disclaimer

This tool is designed for **Local Network Assessment** and educational research. Unauthorized scanning of external networks may be a violation of terms of service or local laws. Use ethically.

---
**Part of the Bar-OS Logistics Ecosystem.**
