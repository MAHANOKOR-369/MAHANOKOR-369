// static/js/ui_controller.js
// អ្នកគ្រប់គ្រងរាល់ការចុចប៊ូតុង និងការផ្លាស់ប្តូរផ្ទៃអេក្រង់ (UI Controller)

// ដំណើរការពេលចុចប៊ូតុង AUTHORIZE COMMAND
async function executeOverride() {
    const keyInput = document.getElementById('masterKeyInput').value;
    const statusText = document.getElementById('sys-status');
    
    // បើមិនទាន់វាយកូដសម្ងាត់
    if(!keyInput) {
        logToTerminal("ERROR: Master Key is required.");
        alert("Requires Master Key!"); // លោតសាររំលឹកនៅលើអេក្រង់
        return;
    }

    // លោតសញ្ញាកំពុងត្រួតពិនិត្យ
    statusText.innerText = "VERIFYING...";
    statusText.style.color = "yellow";
    logToTerminal("Verifying Master Key with Security Matrix...");

    // ហៅ APIHandler មកផ្ទៀងផ្ទាត់ (ទំនាក់ទំនងទៅកាន់ Python)
    const response = await APIHandler.verifyMasterKey(keyInput);

    if(response && response.status === 'success') {
        // បើកូដត្រូវ (SYSTEM ONLINE)
        statusText.innerText = "SYSTEM ONLINE";
        statusText.style.color = "#00ff00"; // ពណ៌បៃតង
        logToTerminal("AUTHORIZATION ACCEPTED: Welcome Commander KHOEM SOKSIVUTHA.");
        if (response.message) logToTerminal(response.message);
        
        // ចំណាំ៖ ការ Update GPS រៀងរាល់ ៣ វិនាទី គឺត្រូវបានធានាដោយ main.js រួចហើយ
        // ដូច្នេះមិនចាំបាច់ហៅអនុគមន៍ស្ទួនគ្នានៅទីនេះទៀតទេ
    } else {
        // បើកូដខុស (ACCESS DENIED)
        statusText.innerText = "ACCESS DENIED";
        statusText.style.color = "red";
        logToTerminal(`CRITICAL: ${response?.message || 'Unauthorized Access Attempt!'}`);
    }
}

// ដំណើរការពេលចុចប៊ូតុងរើសប្លង់មេ ១ ២ ៣ (ហៅពី dashboard.html)
async function loadPanel(panelId) {
    const mainScreen = document.getElementById('main-display-screen');
    
    // បង្ហាញសាររង់ចាំ ពេលកុំព្យូទ័រកំពុងទាញទិន្នន័យ
    mainScreen.innerHTML = `<h2 style="text-align:center; color:yellow; margin-top:50px;">
                                ⏳ កំពុងទាញយកទិន្នន័យប្រព័ន្ធ ${panelId.toUpperCase()}...
                            </h2>`;
    logToTerminal(`Deploying tactical panel: ${panelId}...`);
    
    // ហៅទិន្នន័យពី API មកចាក់បញ្ចូលក្នុងអេក្រង់យក្សកណ្តាល
    const content = await APIHandler.fetchPanelData(panelId);
    mainScreen.innerHTML = content;
    
    logToTerminal(`${panelId.toUpperCase()} deployed successfully on Main Screen.`);
}
