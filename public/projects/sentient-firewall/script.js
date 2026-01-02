/**
 * Sentient Firewall - AI-Powered Threat Detection Demo
 * 
 * Frontend for the Python/PyTorch backend.
 * Connects via WebSocket to receive real-time threat analysis data.
 */

class SentientFirewall {
    constructor() {
        this.isRunning = false;
        this.isDDoSMode = false;
        this.intensity = 3;
        this.stats = {
            threatsBlocked: 0,
            packetsAnalyzed: 0,
            activeRules: 0
        };
        this.attackLog = [];
        this.iptablesRules = [];
        this.blockedIPs = new Set();

        // GitHub Integration
        this.repoOwner = 'NotDonCitron';
        this.repoName = 'sentient-firewall';

        // Connect to Backend API
        this.API_URL = 'http://localhost:5000';
        this.socket = io(this.API_URL);

        this.init();
    }

    init() {
        this.bindEvents();
        this.initSocketEvents();
        this.initNeuralViz();
        this.updateStats();

        // Check initial stats
        this.fetchStats();

        // Load GitHub data
        this.fetchGithubData();
    }

    bindEvents() {
        document.getElementById('startSimulation').addEventListener('click', () => this.start());
        document.getElementById('stopSimulation').addEventListener('click', () => this.stop());
        document.getElementById('simulateDDoS').addEventListener('click', () => this.simulateDDoS());
        document.getElementById('clearLog').addEventListener('click', () => this.clearLog());
        document.getElementById('intensity').addEventListener('input', (e) => {
            this.intensity = parseInt(e.target.value);
            document.getElementById('intensityValue').textContent = this.intensity;
        });
    }

    initSocketEvents() {
        this.socket.on('connect', () => {
            console.log('Connected to Sentient Firewall backend');
            this.logSystem('✅ Connected to backend system.');
            this.fetchStats();
        });

        this.socket.on('disconnect', () => {
            this.logSystem('⚠️ Disconnected from backend.');
        });

        this.socket.on('packet_processed', (data) => {
            if (!this.isRunning) return;
            this.handlePacketData(data);
        });

        this.socket.on('ddos_detected', (data) => {
            if (data.status === 'attack_started') {
                this.logDDoS(`⚠️ DDoS ATTACK DETECTED! Intensity: ${data.estimated_intensity} pps`);
                this.isDDoSMode = true;
            } else if (data.status === 'attack_mitigated') {
                this.logSystem(`✅ DDoS attack mitigated. Blocked ${data.blocked_count} threats.`);
                this.isDDoSMode = false;
            }
        });

        this.socket.on('threat_blocked', (data) => {
            // Provide immediate feedback for blocked threats even outside regular packet stream
            this.logAttack('blocked', data.source_ip, 'UNK', data.pattern, (data.confidence * 100).toFixed(1));
            this.visualizeAttack(true);
            this.fetchStats();
        });
    }

    async fetchStats() {
        try {
            const res = await fetch(`${this.API_URL}/api/stats`);
            if (res.ok) {
                const data = await res.json();
                this.stats.packetsAnalyzed = data.packets_analyzed;
                this.stats.threatsBlocked = data.threats_blocked;
                this.stats.activeRules = data.blocked_ips;
                this.updateStats();
            }
        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    }

    async fetchGithubData() {
        const ghStatus = document.getElementById('ghStatus');
        try {
            // Fetch Repo Info
            const repoRes = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}`);
            if (repoRes.ok) {
                const repo = await repoRes.json();
                document.getElementById('ghStars').textContent = repo.stargazers_count;
                document.getElementById('ghForks').textContent = repo.forks_count;
            }

            // Fetch Latest Release
            const releaseRes = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/releases/latest`);
            if (releaseRes.ok) {
                const release = await releaseRes.json();
                document.getElementById('ghRelease').textContent = release.tag_name;
            } else {
                document.getElementById('ghRelease').textContent = 'v0.1.0-alpha';
            }

            // Fetch Commits
            const commitRes = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/commits?per_page=5`);
            if (commitRes.ok) {
                const commits = await commitRes.json();
                const container = document.getElementById('ghCommits');
                container.innerHTML = '';
                commits.forEach(c => {
                    const li = document.createElement('li');
                    li.className = 'commit-item';
                    const date = new Date(c.commit.author.date).toLocaleDateString();
                    li.innerHTML = `
                        <span class="message" title="${c.commit.message}">${c.commit.message}</span>
                        <span class="date">${date}</span>
                    `;
                    container.appendChild(li);
                });
            }

            ghStatus.textContent = 'LIVE';
            ghStatus.style.background = 'rgba(16, 185, 129, 0.1)';
            ghStatus.style.borderColor = 'var(--success)';
            ghStatus.style.color = 'var(--success)';
        } catch (e) {
            console.error("Failed to fetch GitHub data", e);
            ghStatus.textContent = 'OFFLINE';
            ghStatus.style.background = 'rgba(255, 71, 87, 0.1)';
            ghStatus.style.borderColor = 'var(--accent-danger)';
            ghStatus.style.color = 'var(--accent-danger)';
        }
    }

    async start() {
        try {
            const res = await fetch(`${this.API_URL}/api/start`, { method: 'POST' });
            if (res.ok) {
                this.isRunning = true;
                document.getElementById('startSimulation').disabled = true;
                document.getElementById('stopSimulation').disabled = false;
                this.logSystem('Traffic monitoring started. ML model active.');
            }
        } catch (e) {
            this.logSystem('❌ Failed to start firewall backend.');
        }
    }

    async stop() {
        try {
            const res = await fetch(`${this.API_URL}/api/stop`, { method: 'POST' });
            if (res.ok) {
                this.isRunning = false;
                this.isDDoSMode = false;
                document.getElementById('startSimulation').disabled = false;
                document.getElementById('stopSimulation').disabled = true;
                this.logSystem('Traffic monitoring stopped.');
            }
        } catch (e) {
            this.logSystem('❌ Failed to stop firewall backend.');
        }
    }

    async simulateDDoS() {
        if (!this.isRunning) {
            await this.start();
        }

        try {
            await fetch(`${this.API_URL}/api/simulate/ddos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration: 10, intensity: this.intensity * 20 })
            });
        } catch (e) {
            this.logSystem('❌ Failed to trigger DDoS simulation.');
        }
    }

    handlePacketData(data) {
        const { packet, detection, country, stats } = data;

        // Update local stats from backend
        this.stats.packetsAnalyzed = stats.packets_analyzed;
        this.stats.threatsBlocked = stats.threats_blocked;
        this.stats.activeRules = stats.blocked_ips;

        this.updateStats();

        const isThreat = detection.is_threat;

        if (isThreat) {
            this.handleThreat(packet.src_ip, country, detection);
        } else {
            this.handleLegitimate(packet.src_ip, country);
        }

        this.visualizeAttack(isThreat, country);
        this.pulseNeuralNetwork();

        // occasionally refresh rule list
        if (Math.random() < 0.05) this.fetchRules();
    }

    async fetchRules() {
        try {
            const res = await fetch(`${this.API_URL}/api/rules`);
            if (res.ok) {
                const data = await res.json();
                this.iptablesRules = data.rules;
                this.renderRules();
            }
        } catch (e) { }
    }

    handleThreat(ip, country, detection) {
        // Log the blocked attack
        const confidence = (detection.confidence * 100).toFixed(1);
        const pattern = detection.pattern || detection.threat_type;
        this.logAttack('blocked', ip, country, pattern, confidence);
    }

    handleLegitimate(ip, country) {
        // Occasionally log allowed traffic
        if (Math.random() < 0.1) {
            this.logAttack('allowed', ip, country, 'Normal traffic', '98.5');
        }
    }

    updateStats() {
        document.getElementById('threatsBlocked').textContent = this.formatNumber(this.stats.threatsBlocked);
        document.getElementById('packetsAnalyzed').textContent = this.formatNumber(this.stats.packetsAnalyzed);
        document.getElementById('activeRules').textContent = this.stats.activeRules;
    }

    renderRules() {
        const container = document.getElementById('rulesList');
        if (!container) return;

        container.innerHTML = `
                        <div class="rule-entry header">
                            <span class="chain">CHAIN</span>
                            <span class="source">SOURCE</span>
                            <span class="action">ACTION</span>
                            <span class="reason">CREATED</span>
                        </div>`;

        this.iptablesRules.forEach(rule => {
            const entry = document.createElement('div');
            entry.className = 'rule-entry';
            const createdTime = new Date(rule.created).toLocaleTimeString();
            entry.innerHTML = `
                <span class="chain">${rule.chain}</span>
                <span class="source">${rule.source}</span>
                <span class="action">${rule.action}</span>
                <span class="reason">${createdTime}</span>
            `;
            container.appendChild(entry);
        });

        const countEl = document.getElementById('ruleCount');
        if (countEl) countEl.textContent = `${this.iptablesRules.length} rules`;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    logAttack(type, ip, country, pattern, confidence) {
        const time = new Date().toLocaleTimeString();
        const entry = {
            type,
            ip,
            country,
            pattern,
            confidence,
            time
        };

        this.attackLog.unshift(entry);
        if (this.attackLog.length > 100) {
            this.attackLog.pop();
        }

        this.renderLogEntry(entry);
    }

    logSystem(message) {
        const container = document.getElementById('attackLog');
        if (!container) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry system';
        entry.innerHTML = `
            <span class="time">[SYSTEM]</span>
            <span class="message">${message}</span>
        `;
        container.insertBefore(entry, container.firstChild);
    }

    renderLogEntry(entry) {
        const container = document.getElementById('attackLog');
        if (!container) return;
        const div = document.createElement('div');
        div.className = `log-entry ${entry.type}`;

        if (entry.type === 'blocked') {
            div.innerHTML = `
                <span class="time">[${entry.time}]</span>
                <span class="action">BLOCKED</span>
                <span class="ip">${entry.ip}</span>
                <span class="country">[${entry.country}]</span>
                <span class="pattern">${entry.pattern}</span>
                <span class="confidence">(${entry.confidence}% conf)</span>
            `;
        } else {
            div.innerHTML = `
                <span class="time">[${entry.time}]</span>
                <span class="action">ALLOWED</span>
                <span class="ip">${entry.ip}</span>
                <span class="country">[${entry.country}]</span>
            `;
        }

        container.insertBefore(div, container.firstChild);

        while (container.children.length > 50) {
            container.removeChild(container.lastChild);
        }
    }

    clearLog() {
        const container = document.getElementById('attackLog');
        if (container) container.innerHTML = '';
        this.logSystem('Log cleared.');
    }

    logDDoS(message) {
        const container = document.getElementById('attackLog');
        if (!container) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry ddos';
        entry.innerHTML = `
            <span class="time">[ALERT]</span>
            <span class="message" style="color: var(--accent-warning); font-weight: bold;">${message}</span>
        `;
        container.insertBefore(entry, container.firstChild);
    }

    visualizeAttack(isThreat, country) {
        const map = document.getElementById('threatMap');
        if (!map) return;

        const x = Math.random() * 80 + 10;
        const y = Math.random() * 80 + 10;

        const ping = document.createElement('div');
        ping.className = `attack-ping ${isThreat ? 'blocked' : 'allowed'}`;
        ping.style.left = `${x}%`;
        ping.style.top = `${y}%`;
        map.appendChild(ping);

        const line = document.createElement('div');
        line.className = `attack-line ${isThreat ? 'blocked' : 'allowed'}`;

        const hubX = 50;
        const hubY = 50;
        const dx = hubX - x;
        const dy = hubY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        line.style.left = `${x}%`;
        line.style.top = `${y}%`;
        line.style.width = `${distance}%`;
        line.style.transform = `rotate(${angle}deg)`;
        map.appendChild(line);

        setTimeout(() => {
            ping.remove();
            line.remove();
        }, 2000);
    }

    initNeuralViz() {
        const container = document.getElementById('neuralViz');
        if (!container || container.children.length > 0) return;

        const layers = [4, 8, 8, 4, 2];
        const width = container.offsetWidth || 200;
        const height = container.offsetHeight || 150;

        this.nodes = [];

        layers.forEach((nodeCount, layerIndex) => {
            const layerX = (width / (layers.length + 1)) * (layerIndex + 1);

            for (let i = 0; i < nodeCount; i++) {
                const nodeY = (height / (nodeCount + 1)) * (i + 1);

                const node = document.createElement('div');
                node.className = 'neural-node';
                node.style.left = `${layerX - 6}px`;
                node.style.top = `${nodeY - 6}px`;
                container.appendChild(node);

                this.nodes.push({ element: node, layer: layerIndex, index: i });
            }
        });

        for (let i = 0; i < layers.length - 1; i++) {
            const currentLayerNodes = this.nodes.filter(n => n.layer === i);
            const nextLayerNodes = this.nodes.filter(n => n.layer === i + 1);

            currentLayerNodes.forEach(current => {
                nextLayerNodes.forEach(next => {
                    if (Math.random() < 0.3) {
                        const connection = document.createElement('div');
                        connection.className = 'neural-connection';

                        const x1 = parseFloat(current.element.style.left) + 6;
                        const y1 = parseFloat(current.element.style.top) + 6;
                        const x2 = parseFloat(next.element.style.left) + 6;
                        const y2 = parseFloat(next.element.style.top) + 6;

                        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                        connection.style.left = `${x1}px`;
                        connection.style.top = `${y1}px`;
                        connection.style.width = `${length}px`;
                        connection.style.transform = `rotate(${angle}deg)`;

                        container.insertBefore(connection, container.firstChild);
                    }
                });
            });
        }
    }

    pulseNeuralNetwork() {
        if (!this.nodes) return;
        const nodesToActivate = Math.floor(Math.random() * 5) + 2;

        for (let i = 0; i < nodesToActivate; i++) {
            const randomNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
            randomNode.element.classList.add('active');

            setTimeout(() => {
                randomNode.element.classList.remove('active');
            }, 500);
        }
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.firewall = new SentientFirewall();
});