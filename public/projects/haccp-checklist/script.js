// Bar-OS: Neural HACCP Protocol - Logic
document.addEventListener('DOMContentLoaded', function () {
    // SYNC SYSTEM TIME
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-date').value = today;

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    document.getElementById('control-time').value = timeStr;

    // INITIALIZE SUBSYSTEMS
    setupTempInputs();
    setupWareneingang();
    setupButtons();
    loadHistory();

    console.log("Bar-OS: Neural HACCP Protocol v4.0.2 initialized.");
});

function setupTempInputs() {
    const inputs = document.querySelectorAll('.temp-input');

    inputs.forEach(function (input) {
        input.addEventListener('change', function () {
            const min = parseFloat(this.dataset.min);
            const max = parseFloat(this.dataset.max);
            const value = parseFloat(this.value);
            const statusCell = this.closest('tr').querySelector('.status-cell');

            if (isNaN(value)) {
                statusCell.textContent = 'NO_DATA';
                statusCell.className = 'status-cell';
                return;
            }

            // Simulated Neural Validation Delay
            statusCell.textContent = 'ANALYZING...';
            statusCell.className = 'status-cell status-warn';

            setTimeout(() => {
                if (value >= min && value <= max) {
                    statusCell.textContent = 'VALIDATED [OK]';
                    statusCell.className = 'status-cell status-ok';
                } else if (value < min - 2 || value > max + 2) {
                    statusCell.textContent = 'DANGER [CRITICAL]';
                    statusCell.className = 'status-cell status-bad';
                    showToast('THERMAL_ANOMALY DETECTED!', 'error');
                } else {
                    statusCell.textContent = 'WARNING [LIMIT]';
                    statusCell.className = 'status-cell status-warn';
                }
            }, 600);
        });
    });
}

function setupWareneingang() {
    const addBtn = document.getElementById('add-waren');

    addBtn.addEventListener('click', function () {
        const name = document.getElementById('waren-name').value.trim();
        const temp = document.getElementById('waren-temp').value;
        const status = document.getElementById('waren-status').value;

        if (!name) {
            showToast('ERROR: PRODUCT_ID_REQUIRED', 'error');
            return;
        }

        const time = new Date().toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const tbody = document.getElementById('waren-list');
        const tr = document.createElement('tr');

        const statusClass = status === 'ok' ? 'status-ok' : 'status-bad';
        const statusText = status === 'ok' ? 'ACCEPTED' : 'REJECTED';

        tr.innerHTML = `
            <td>#${escapeHtml(name)}</td>
            <td>${temp ? temp + '°C' : 'N/A'}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>${time}</td>
        `;

        tbody.appendChild(tr);

        document.getElementById('waren-name').value = '';
        document.getElementById('waren-temp').value = '';

        showToast('DATA_LOGGED: INBOUND_CARGO_REGISTERED', 'success');
    });
}

function setupButtons() {
    document.getElementById('save-btn').addEventListener('click', function () {
        saveChecklist();
    });

    document.getElementById('print-btn').addEventListener('click', function () {
        window.print();
    });

    document.getElementById('export-btn').addEventListener('click', function () {
        exportAsText();
    });
}

function saveChecklist() {
    const data = collectData();

    if (!data.controller) {
        showToast('ERROR: BIOMETRIC_ID_MISSING', 'error');
        return;
    }

    const history = JSON.parse(localStorage.getItem('haccp-history') || '[]');
    history.unshift(data);
    if (history.length > 30) history.pop();

    localStorage.setItem('haccp-history', JSON.stringify(history));

    showToast('PROTOCOL_DUMP_SUCCESS: COMMITTED_TO_CORE', 'success');
    loadHistory();
}

function collectData() {
    const data = {
        date: document.getElementById('check-date').value,
        shift: document.getElementById('shift').value,
        time: document.getElementById('control-time').value,
        controller: document.getElementById('controller-name').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        timestamp: new Date().toISOString()
    };

    data.temps = [];
    document.querySelectorAll('#temp-checks tr').forEach(function (row) {
        const geraet = row.cells[0].textContent;
        const input = row.querySelector('.temp-input');
        const status = row.querySelector('.status-cell').textContent;

        if (input && input.value) {
            data.temps.push({ geraet, temp: input.value, status });
        }
    });

    data.hygiene = [];
    document.querySelectorAll('#hygiene-checks input[type="checkbox"]').forEach(function (cb) {
        data.hygiene.push({ task: cb.dataset.task, checked: cb.checked });
    });

    data.waren = [];
    document.querySelectorAll('#waren-list tr').forEach(function (row) {
        data.waren.push({
            produkt: row.cells[0].textContent,
            temp: row.cells[1].textContent,
            status: row.cells[2].textContent,
            zeit: row.cells[3].textContent
        });
    });

    return data;
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('haccp-history') || '[]');
    const container = document.getElementById('history-list');

    if (history.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.7rem;">[NO_RECORDS_FOUND_IN_LOCAL_BUFFER]</p>';
        return;
    }

    container.innerHTML = '';
    history.slice(0, 5).forEach(function (entry) {
        const div = document.createElement('div');
        div.className = 'history-item';

        const phase = entry.shift === 'frueh' ? 'ALPHA' : 'OMEGA';

        div.innerHTML = `
            <div class="date">${entry.date} [${phase}_PHASE]</div>
            <div class="summary">
                OP: ${escapeHtml(entry.controller)} | SYNC: ${entry.time}<br>
                BIO: ${entry.hygiene ? entry.hygiene.filter(h => h.checked).length : 0} LKD | 
                THERM: ${entry.temps ? entry.temps.length : 0} SNS |
                LOG: ${entry.waren ? entry.waren.length : 0} PKT
            </div>
        `;
        container.appendChild(div);
    });
}

function exportAsText() {
    const data = collectData();
    let text = '=== Bar-OS // NEURAL HACCP PROTOCOL ===\n\n';
    text += 'SESSION_DATE: ' + data.date + '\n';
    text += 'OPS_PHASE: ' + (data.shift === 'frueh' ? 'ALPHA' : 'OMEGA') + '\n';
    text += 'OPERATOR_ID: ' + data.controller + '\n';
    text += 'SYNC_TIME: ' + data.time + '\n\n';

    text += '--- [THERMAL_SURVEILLANCE] ---\n';
    data.temps.forEach(t => text += t.geraet + ': ' + t.temp + '°C [' + t.status + ']\n');

    text += '\n--- [PROTOCOL_COMPLIANCE] ---\n';
    data.hygiene.forEach(h => text += (h.checked ? '[LOCKED]' : '[OPEN]') + ' ' + h.task + '\n');

    if (data.waren.length > 0) {
        text += '\n--- [INBOUND_LOGISTICS] ---\n';
        data.waren.forEach(w => text += w.produkt + ' | ' + w.temp + ' | ' + w.status + ' | ' + w.zeit + '\n');
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PROTO_CORE_' + data.date + '.txt';
    a.click();
    showToast('DATA_EXTRACT_COMPLETE', 'success');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + (type || '');

    setTimeout(function () {
        toast.className = 'toast';
    }, 2500);
}