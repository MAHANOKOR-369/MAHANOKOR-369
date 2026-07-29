// Controls the HTML Interface Updates
document.addEventListener("DOMContentLoaded", () => {
    updateDashboard();
    setInterval(updateDashboard, 5000); // Auto-refresh every 5s
});

async function updateDashboard() {
    const data = await API.getSystemStatus();
    if (data) {
        document.getElementById('sys-status').innerText = data.core_status;
        document.getElementById('gps-data').innerText = `LAT: ${data.gps_matrix.latitude} | LON: ${data.gps_matrix.longitude}`;
        addTerminalLog("Data Synced via AI Controller.");
    }
}

async function executeOverride() {
    const key = document.getElementById('masterKeyInput').value;
    if (!key) return alert("Requires Master Key!");
    
    const result = await API.sendCommand(key, "MASTER_OVERRIDE");
    addTerminalLog(result.message);
}

function addTerminalLog(msg) {
    const logBox = document.getElementById('terminal-logs');
    if (logBox) {
        const time = new Date().toLocaleTimeString();
        logBox.innerHTML += `<br><span style="color:var(--neon-blue)">[${time}]</span> ${msg}`;
        logBox.scrollTop = logBox.scrollHeight;
    }
}
