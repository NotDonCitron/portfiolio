// Bar-OS: IoT-Sentinel - Live Node Interface
const API_BASE = "http://localhost:5001/api";

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const navButtons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('.section');
    const scanBtn = document.getElementById('scan-btn');
    const subnetInput = document.getElementById('subnet-input');
    const simpleLog = document.getElementById('simple-log');
    const consoleOutput = document.getElementById('console-output');
    const deviceGrid = document.getElementById('device-grid');

    // Stats
    const totalDevicesEl = document.getElementById('total-devices');
    const secureCountEl = document.getElementById('secure-count');
    const vulnerableCountEl = document.getElementById('vulnerable-count');
    const securityScoreEl = document.getElementById('security-score');
    const scoreFill = document.querySelector('.score-fill');

    // Navigation
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.section;
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
            logToConsole(`[SYSTEM] Switched context to: ${target.toUpperCase()}`);
        });
    });

    // Logging Utility
    function logToConsole(msg, type = 'info') {
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:var(--text-muted)">[${time}]</span> <span class="${type}">${msg}</span>`;

        consoleOutput.appendChild(line.cloneNode(true));
        consoleOutput.scrollTop = consoleOutput.scrollHeight;

        simpleLog.innerHTML = msg; // Update dashboard small log
    }

    // Node Rendering
    function renderNodes(devices) {
        deviceGrid.innerHTML = '';
        if (devices.length === 0) {
            deviceGrid.innerHTML = '<div class="empty-notice">[NO_DEVICES_FOUND_ON_SUBNET]</div>';
            return;
        }

        devices.forEach(node => {
            const isVulnerable = node.vulnerability_score > 20;
            const card = document.createElement('div');
            card.className = 'node-card';
            card.innerHTML = `
                <div class="node-header">
                    <span class="node-ip">${node.ip}</span>
                    <div class="node-status-icon ${isVulnerable ? 'vulnerable' : 'secure'}"></div>
                </div>
                <div class="node-name">${node.hostname}</div>
                <div class="node-services" style="font-size: 0.6rem; color: var(--neon-cyan)">
                    ${node.services.length} PORTS_OPEN
                </div>
            `;
            deviceGrid.appendChild(card);
        });
    }

    // Stats Update
    async function updateStats() {
        try {
            const res = await fetch(`${API_BASE}/stats`);
            const data = await res.json();

            totalDevicesEl.textContent = data.total;
            secureCountEl.textContent = data.secure;
            vulnerableCountEl.textContent = data.vulnerable;
            securityScoreEl.textContent = `${data.score}%`;
            scoreFill.style.width = `${data.score}%`;

            if (data.score < 50) scoreFill.style.background = 'var(--neon-red)';
            else if (data.score < 80) scoreFill.style.background = 'var(--neon-yellow)';
            else scoreFill.style.background = 'var(--neon-green)';
        } catch (err) {
            console.error("Stats fetch failed", err);
        }
    }

    // Scanning Logic
    scanBtn.addEventListener('click', async () => {
        const subnet = subnetInput.value.trim();

        logToConsole(`[SENTINEL] Initializing deep packet sweep...`, 'info');
        scanBtn.disabled = true;
        scanBtn.textContent = "SWEEPING...";

        try {
            const res = await fetch(`${API_BASE}/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subnet: subnet || null })
            });
            const data = await res.json();

            logToConsole(`[SUCCESS] Sweep complete. Found ${data.device_count} targets.`, 'info');
            renderNodes(data.devices);
            await updateStats();
            showToast("NETWORK_SWEEP_COMPLETE");

        } catch (err) {
            logToConsole(`[ERROR] Scan subsystem failure: ${err.message}`, 'error');
            showToast("SUBSYSTEM_FAILURE", "error");
        } finally {
            scanBtn.disabled = false;
            scanBtn.textContent = "INITIATE_SWEEP";
        }
    });

    // Attack Simulation
    document.getElementById('execute-attack-btn').addEventListener('click', () => {
        const type = document.getElementById('attack-type').value;
        const attackLog = document.getElementById('attack-log');

        attackLog.innerHTML = `<span style="color:var(--neon-red)">[ALERT] EXECUTING: ${type}...</span>`;

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            attackLog.innerHTML = `<span style="color:var(--neon-red)">[ALERT] EXECUTING: ${type} [${progress}%]</span>`;
            if (progress >= 100) {
                clearInterval(interval);
                attackLog.innerHTML = `<span style="color:var(--neon-green)">[SUCCESS] TARGET_VULNERABILITY_CONFIRMED: ${type}</span>`;
            }
        }, 200);
    });

    // Toast Utility
    function showToast(msg, type = '') {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Initial State
    logToConsole("Bar-OS: IoT-Sentinel [STABLE_BUILD_4.0.2] loaded.");
});