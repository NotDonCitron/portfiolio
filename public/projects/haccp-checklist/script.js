// HACCP Checkliste - JavaScript
// Einfache, funktionale Implementierung

// Beim Laden
document.addEventListener('DOMContentLoaded', function() {
    // Heutiges Datum setzen
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-date').value = today;
    
    // Aktuelle Uhrzeit setzen
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    document.getElementById('control-time').value = timeStr;
    
    // Event Listener
    setupTempInputs();
    setupWareneingang();
    setupButtons();
    loadHistory();
});

// Temperatur-Inputs
function setupTempInputs() {
    const inputs = document.querySelectorAll('.temp-input');
    
    inputs.forEach(function(input) {
        input.addEventListener('change', function() {
            const min = parseFloat(this.dataset.min);
            const max = parseFloat(this.dataset.max);
            const value = parseFloat(this.value);
            const statusCell = this.closest('tr').querySelector('.status-cell');
            
            if (isNaN(value)) {
                statusCell.textContent = '-';
                statusCell.className = 'status-cell';
                return;
            }
            
            if (value >= min && value <= max) {
                statusCell.textContent = '✓ OK';
                statusCell.className = 'status-cell status-ok';
            } else if (value < min - 2 || value > max + 2) {
                statusCell.textContent = '✗ KRITISCH';
                statusCell.className = 'status-cell status-bad';
            } else {
                statusCell.textContent = '! Grenzwert';
                statusCell.className = 'status-cell status-warn';
            }
        });
    });
}

// Wareneingang
function setupWareneingang() {
    const addBtn = document.getElementById('add-waren');
    
    addBtn.addEventListener('click', function() {
        const name = document.getElementById('waren-name').value.trim();
        const temp = document.getElementById('waren-temp').value;
        const status = document.getElementById('waren-status').value;
        
        if (!name) {
            showToast('Bitte Produktname eingeben', 'error');
            return;
        }
        
        const time = new Date().toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const tbody = document.getElementById('waren-list');
        const tr = document.createElement('tr');
        
        const statusClass = status === 'ok' ? 'status-ok' : 'status-bad';
        const statusText = status === 'ok' ? 'OK' : 'Abgelehnt';
        
        tr.innerHTML = `
            <td>${escapeHtml(name)}</td>
            <td>${temp ? temp + '°C' : '-'}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>${time}</td>
        `;
        
        tbody.appendChild(tr);
        
        // Felder leeren
        document.getElementById('waren-name').value = '';
        document.getElementById('waren-temp').value = '';
        document.getElementById('waren-status').value = 'ok';
        
        showToast('Wareneingang dokumentiert', 'success');
    });
}

// Buttons
function setupButtons() {
    // Speichern
    document.getElementById('save-btn').addEventListener('click', function() {
        saveChecklist();
    });
    
    // Drucken
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });
    
    // Export (einfacher Text-Export)
    document.getElementById('export-btn').addEventListener('click', function() {
        exportAsText();
    });
}

// Speichern
function saveChecklist() {
    const data = collectData();
    
    if (!data.controller) {
        showToast('Bitte Namen eintragen', 'error');
        return;
    }
    
    // In localStorage speichern
    const history = JSON.parse(localStorage.getItem('haccp-history') || '[]');
    history.unshift(data);
    
    // Nur letzte 30 Einträge behalten
    if (history.length > 30) {
        history.pop();
    }
    
    localStorage.setItem('haccp-history', JSON.stringify(history));
    
    showToast('Checkliste gespeichert!', 'success');
    loadHistory();
}

// Daten sammeln
function collectData() {
    const data = {
        date: document.getElementById('check-date').value,
        shift: document.getElementById('shift').value,
        time: document.getElementById('control-time').value,
        controller: document.getElementById('controller-name').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Temperaturen
    data.temps = [];
    document.querySelectorAll('#temp-checks tr').forEach(function(row) {
        const geraet = row.cells[0].textContent;
        const input = row.querySelector('.temp-input');
        const status = row.querySelector('.status-cell').textContent;
        
        if (input && input.value) {
            data.temps.push({
                geraet: geraet,
                temp: input.value,
                status: status
            });
        }
    });
    
    // Hygiene Checks
    data.hygiene = [];
    document.querySelectorAll('#hygiene-checks input[type="checkbox"]').forEach(function(cb) {
        data.hygiene.push({
            task: cb.dataset.task,
            checked: cb.checked
        });
    });
    
    // Wareneingang
    data.waren = [];
    document.querySelectorAll('#waren-list tr').forEach(function(row) {
        data.waren.push({
            produkt: row.cells[0].textContent,
            temp: row.cells[1].textContent,
            status: row.cells[2].textContent,
            zeit: row.cells[3].textContent
        });
    });
    
    return data;
}

// History laden
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('haccp-history') || '[]');
    const container = document.getElementById('history-list');
    
    if (history.length === 0) {
        container.innerHTML = '<p style="color:#666;font-size:0.9rem;">Noch keine Einträge vorhanden.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    // Nur letzte 5 anzeigen
    history.slice(0, 5).forEach(function(entry) {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const schicht = entry.shift === 'frueh' ? 'Frühschicht' : 'Spätschicht';
        const hygieneCount = entry.hygiene ? entry.hygiene.filter(h => h.checked).length : 0;
        const hygieneTotal = entry.hygiene ? entry.hygiene.length : 0;
        
        div.innerHTML = `
            <div class="date">${formatDate(entry.date)} - ${schicht}</div>
            <div class="summary">
                Kontrolliert von: ${escapeHtml(entry.controller)} um ${entry.time} Uhr<br>
                Hygiene: ${hygieneCount}/${hygieneTotal} erledigt | 
                Temperaturen: ${entry.temps ? entry.temps.length : 0} gemessen |
                Wareneingang: ${entry.waren ? entry.waren.length : 0} Posten
            </div>
        `;
        
        container.appendChild(div);
    });
}

// Text-Export
function exportAsText() {
    const data = collectData();
    
    let text = '=== HACCP KONTROLLPROTOKOLL ===\n\n';
    text += 'Datum: ' + formatDate(data.date) + '\n';
    text += 'Schicht: ' + (data.shift === 'frueh' ? 'Frühschicht' : 'Spätschicht') + '\n';
    text += 'Kontrolliert von: ' + data.controller + '\n';
    text += 'Uhrzeit: ' + data.time + '\n\n';
    
    text += '--- TEMPERATUREN ---\n';
    data.temps.forEach(function(t) {
        text += t.geraet + ': ' + t.temp + '°C (' + t.status + ')\n';
    });
    
    text += '\n--- HYGIENE-CHECKS ---\n';
    data.hygiene.forEach(function(h) {
        text += (h.checked ? '[X]' : '[ ]') + ' ' + h.task + '\n';
    });
    
    if (data.waren.length > 0) {
        text += '\n--- WARENEINGANG ---\n';
        data.waren.forEach(function(w) {
            text += w.produkt + ' | ' + w.temp + ' | ' + w.status + ' | ' + w.zeit + '\n';
        });
    }
    
    if (data.notes) {
        text += '\n--- BEMERKUNGEN ---\n';
        text += data.notes + '\n';
    }
    
    text += '\n=== ENDE DES PROTOKOLLS ===';
    
    // Download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HACCP_' + data.date + '_' + data.shift + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Export erstellt', 'success');
}

// Hilfsfunktionen
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    return parts[2] + '.' + parts[1] + '.' + parts[0];
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
    
    setTimeout(function() {
        toast.className = 'toast';
    }, 2500);
}