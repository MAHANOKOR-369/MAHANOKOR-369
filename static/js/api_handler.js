// static/js/api_handler.js
// អ្នកនាំសារផ្លូវការ (API Handler) សម្រាប់តភ្ជាប់ Frontend ទៅកាន់ Python Backend (Flask)

class APIHandler {
    
    // សេវាកម្មទី១៖ ផ្ទៀងផ្ទាត់កូដសម្ងាត់ (បញ្ជូនទៅកាន់ Python)
    static async verifyMasterKey(key) {
        try {
            const response = await fetch('/api/execute-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // បញ្ជូន Master Key និងបញ្ជាសុំសិទ្ធិ (Authorize) ទៅកាន់ Python
                body: JSON.stringify({ master_key: key, phase: 3, command: 'AUTHORIZE' })
            });
            // រំពឹងថា Python នឹងតបមកវិញនូវ JSON ដូចជា: { "status": "success", "message": "..." }
            return await response.json();
        } catch (error) {
            console.error("Core Sync Failed:", error);
            // បើ Server Python បិទ វានឹងលោត Error នេះ
            return { status: 'error', message: 'Connection Terminated. Flask Server Offline.' };
        }
    }

    // សេវាកម្មទី២៖ ទាញយកទិន្នន័យ GPS ឬស្ថានភាពប្រព័ន្ធពីម៉ាស៊ីនមេ
    static async fetchGPSData() {
        try {
            const response = await fetch('/api/system-status');
            const data = await response.json();
            // បើ Python ឆ្លើយតបមានទិន្នន័យ GPS យកវាមកបង្ហាញ, បើគ្មាន បង្ហាញលេខកូដបម្រុង
            return data.gps_coordinates || "LAT: 11.5564 | LON: 104.9282 | STATUS: ACTIVE (CAMBODIA)";
        } catch (error) {
            console.error("GPS Sync Failed:", error);
            return "ERROR: GPS SIGNAL LOST. RETRYING...";
        }
    }
    
    // សេវាកម្មទី៣៖ ទាញយកប្លង់មេទាំង ៣ មកបង្ហាញ (ផ្នែកនេះយើងលោតជា HTML សិន ព្រោះមិនទាន់មាន API ដាច់ដោយឡែក)
    static async fetchPanelData(panelName) {
        return `<div class="glass-panel" style="padding:20px; border:1px solid var(--neon-blue); color:white;">
                    <h3 style="color:var(--neon-gold);">[ ប្រព័ន្ធបានភ្ជាប់៖ ${panelName.toUpperCase()} ]</h3>
                    <p style="color:var(--neon-green);">✔ ម៉ាស៊ីនកំពុងដំណើរការ 100% តាមការបញ្ជារបស់មេបញ្ជាការ KHOEM SOKSIVUTHA។</p>
                    <p style="font-family:monospace; color:var(--text-main); margin-top:10px;">រង់ចាំការបញ្ជូនទិន្នន័យលម្អិតពី AI Matrix...</p>
                 </div>`;
    }
}


