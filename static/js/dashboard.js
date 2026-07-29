// Handles all API Requests to Flask Backend
const API = {
    async getSystemStatus() {
        try {
            const response = await fetch('/api/system-status');
            return await response.json();
        } catch (error) {
            console.error("Core Sync Failed:", error);
            return null;
        }
    },

    async sendCommand(key, command) {
        try {
            const response = await fetch('/api/execute-command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ master_key: key, phase: 3, command: command })
            });
            return await response.json();
        } catch (error) {
            return { message: "Connection Terminated." };
        }
    }
};

