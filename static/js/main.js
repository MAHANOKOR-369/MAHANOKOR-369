// static/js/main.js
// MAHANOKOR 369 MAIN JAVASCRIPT ENGINE

document.addEventListener("DOMContentLoaded", () => {
    console.log("⚡ Imperial JS Matrix Initialized...");
    
    // បង្ហាញសារនៅលើអេក្រង់ Dashboard
    logToTerminal("System Core JS Initialized.");
    logToTerminal("Awaiting Commander Authorization...");
    
    // ចាប់ផ្តើមប្រព័ន្ធទាញយកទិន្នន័យ (Sync) ពី Python Backend ដោយស្វ័យប្រវត្តិ
    startRealtimeSync();
});

// មុខងារ Refresh ទិន្នន័យរៀងរាល់ ៣ វិនាទី
function startRealtimeSync() {
    fetchMetrics();
    setInterval(fetchMetrics, 3000);
}

// មុខងារទាញទិន្នន័យពីម៉ាស៊ីនមេ
async function fetchMetrics() {
    try {
        const response = await fetch('/api/system-status');
        const data = await response.json();
        
        // ធ្វើបច្ចុប្បន្នភាពទិន្នន័យលើអេក្រង់
        if (data.core_status) {
            updateUI('sys-status', data.core_status);
        }
        if (data.gps_matrix) {
            updateUI('gps-data', `LAT: ${data.gps_matrix.latitude} | LON: ${data.gps_matrix.longitude}`);
        }
        if (data.energy_grid) {
            updateUI('energy-data', `CAPACITY: ${data.energy_grid.capacity_percentage} | EMISSION: ${data.energy_grid.carbon_emission}`);
        }
        
    } catch (error) {
        // បើកូដ Python មិនទាន់ដើរ វានឹងលាក់ Error សិន មិនឱ្យរំខានដល់អេក្រង់បញ្ជាទេ
        console.warn("Syncing with core system... Waiting for Python Backend.");
    }
}

// អនុគមន៍សម្រាប់បញ្ជូនទិន្នន័យទៅបង្ហាញលើ HTML
function updateUI(elementId, textContent) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = textContent;
}

// អនុគមន៍សម្រាប់រុញសារទៅកាន់ប្រអប់ EMPIRE TERMINAL LOGS លើអេក្រង់ (ជំនួស appendLog)
function logToTerminal(message) {
    const logContainer = document.getElementById('terminal-logs');
    if (logContainer) {
        const time = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        // ប្រើប្រាស់ពណ៌ neon-blue ឱ្យស៊ីនឹងសោភ័ណភាព Dashboard
        logLine.innerHTML = `<span style="color:var(--neon-blue);">[${time}]</span> ${message}`;
        logContainer.appendChild(logLine);
        // រំកិល Scroll ទៅក្រោមជានិច្ច ដើម្បីឱ្យបងឃើញសារថ្មីៗ
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}


