// MAHANOKOR 369 MAIN JAVASCRIPT ENGINE

document.addEventListener("DOMContentLoaded", () => {
    console.log("⚡ Imperial JS Matrix Initialized...");
    startRealtimeSync();
});

// Auto Refresh Data Every 3 Seconds
function startRealtimeSync() {
    fetchMetrics();
    setInterval(fetchMetrics, 3000);
}

async function fetchMetrics() {
    try {
        const response = await fetch('/api/system-status');
        const data = await response.json();
        
        updateUI('sys-status', data.core_status);
        updateUI('gps-data', `LAT: ${data.gps_matrix.latitude} | LON: ${data.gps_matrix.longitude}`);
        updateUI('energy-data', `CAPACITY: ${data.energy_grid.capacity_percentage} | EMISSION: ${data.energy_grid.carbon_emission}`);
        
    } catch (error) {
        console.warn("Syncing with core system...");
    }
}

function updateUI(elementId, textContent) {
    const el = document.getElementById(elementId);
    if (el) el.innerText = textContent;
}

function appendLog(message) {
    const logContainer = document.getElementById('terminalLogs');
    if (logContainer) {
        const time = new Date().toLocaleTimeString();
        const logLine = document.createElement('div');
        logLine.innerHTML = `<span style="color:#00f0ff;">[${time}]</span> ${message}`;
        logContainer.appendChild(logLine);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
}
