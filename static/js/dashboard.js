.healthLevels.agri + "%";
        agriBar.className = systemState.healthLevels.agri < 50 ? "bg-red-500 h-1 transition-all" : "bg-emerald-500 h-1 transition-all";
    }
    if (healthText && healthBar) {
        healthText.innerText = systemState.healthLevels.health + "%";
        healthBar.style.width = systemState.healthLevels.health + "%";
        healthBar.className = systemState.healthLevels.health < 50 ? "bg-red-500 h-1 transition-all" : "bg-emerald-500 h-1 transition-all";
    }
}

function populateTables() {
    const logisticsT = document.getElementById("logisticstable");
    if (logisticsT) {
        logisticsT.innerHTML = `
            <tr class="border-b border-slate-800/40"><td class="py-1.5">LGT-01</td><td>ដឹកជញ្ជូនអង្ករកម្ពុជា</td><td class="text-right text-emerald-400">កំពុងរត់</td></tr>
            <tr class="border-b border-slate-800/40"><td class="py-1.5">LGT-02</td><td>ផ្លូវសមុទ្រកំពង់សោម</td><td class="text-right text-cyan-400">រង់ចាំ</td></tr>
        `;
    }

    const sustainT = document.getElementById("sustainabilitytable");
    if (sustainT) {
        sustainT.innerHTML = `
            <tr class="border-b border-slate-800/40"><td class="py-1.5">E-369</td><td>ថាមពលសូឡា Solar Grid</td><td class="text-right text-yellow-400">98% Active</td></tr>
        `;
    }

    const secT = document.getElementById("securitytable");
    if (secT) {
        secT.innerHTML = `
            <tr class="border-b border-slate-800/40"><td class="py-1.5">SEC-99</td><td>តំបន់រ៉ាដាព្រំដែន</td><td class="text-right text-emerald-400">សុវត្ថិភាព 100%</td></tr>
        `;
    }

    const hotelT = document.getElementById("hoteltable");
    if (hotelT) {
        hotelT.innerHTML = `
            <tr class="border-b border-slate-800/40"><td class="py-1.5">HTL-101</td><td>VIP Eco Suite 369</td><td class="text-right text-emerald-400">ទំនេរ (Available)</td></tr>
        `;
    }
}

// 4. Socket.IO Listeners & Voice Commands
socket.on('system_alert', function(data) {
    logger.write(`🔔 [system]: ${data.message}`, data.color);
});

socket.on('command_response', function(data) {
    logger.write(`⚡ [ai-core]: ប្រតិបត្តិការ ${data.action} ជោគជ័យ | time: ${data.timestamp}`, "#eab308");
});

socket.on('hardware_telemetry', function(data) {
    const cpuText = document.getElementById("cputemp");
    const cpuBar = document.getElementById("cpubar");
    if (cpuText) cpuText.innerText = data.cpu + "%";
    if (cpuBar) {
        cpuBar.style.width = data.cpu + "%";
        cpuBar.className = data.cpu > 80 ? "bg-red-500 h-1.5 transition-all" : "bg-cyan-500 h-1.5 transition-all";
    }

    const ramText = document.getElementById("ramtemp");
    const ramBar = document.getElementById("rambar");
    if (ramText) ramText.innerText = data.ram + "%";
    if (ramBar) {
        ramBar.style.width = data.ram + "%";
        ramBar.className = data.ram > 85 ? "bg-red-500 h-1.5 transition-all" : "bg-yellow-500 h-1.5 transition-all";
    }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    window.startVoiceCommand = function() {
        logger.write("🎙️ [voice]: AI កំពុងស្តាប់... (សូមនិយាយ 'Lock System' ឬ 'Scan Network')", "#00bfff");
        recognition.start();
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        logger.write(`🗣️ [voice input]: "${transcript}"`, "#cbd5e1");
        
        if (transcript.includes("lock system") || transcript.includes("lock")) {
            customtrigger("lock_system");
        } else if (transcript.includes("scan network")) {
            customtrigger("scan_net");
        } else if (transcript.includes("unlock")) {
            logger.write("⚠️ [security]: ទាមទារការវាយបញ្ចូលលេខកូដ Master Key ជាបន្ទាន់!", "#ef4444");
            customtrigger("lock_system"); 
        } else {
            logger.write("❌ [voice error]: បញ្ជាមិនស្គាល់ក្នុងប្រព័ន្ធទិន្នន័យសកល។", "#ef4444");
        }
    };
} else {
    window.startVoiceCommand = function() {
        logger.write("⚠️ Browser របស់អ្នកមិនគាំទ្រមុខងារបញ្ជាដោយសំឡេងទេ។", "#ef4444");
    }
}

// 5. Master Command Triggers
window.customtrigger = function (action) {
    const montext = document.getElementById("monitortext");

    if (action === "request_media_permission") {
        initMediaDevices();
        return;
    }
    
    // Auth Check
    if (action === "unlock_system") {
        const pass = document.getElementById("masterkey").value;
        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pass })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById("lockscreen").classList.add("hidden");
                document.getElementById("lockerrormsg").classList.add("hidden");
                logger.write("🔓 [security]: ដោះសោប្រព័ន្ធជាន់ខ្ពស់ជោគជ័យដោយ AI Backend!", "#10b981");
            } else {
                document.getElementById("lockerrormsg").classList.remove("hidden");
                document.getElementById("lockerrormsg").innerText = data.message;
            }
        });
        return;
    }

    if (action === "lock_system") {
        document.getElementById("lockscreen").classList.remove("hidden");
        return;
    }

    if (action === "quantum_voice") {
        startVoiceCommand();
        return;
    }

    // Sigil & Map Views
    if (action === "sigil_eye_1") {
        if (montext) montext.innerHTML = "[sigil]: ចក្ខុទិព្វស្កេនលំហអាកាសទី១ - Divine Eye Alpha active";
        if (map) map.setView([11.5564, 104.9282], 14);
    } else if (action === "sigil_eye_2") {
        if (montext) montext.innerHTML = "[sigil]: ចក្ខុទិព្វឆ្លុះផ្ទៃមេឃទី២ - Divine Eye Beta active";
        if (map) map.setView([13.3633, 103.8564], 12);
    } else if (action === "sigil_eye_3") {
        if (montext) montext.innerHTML = "[sigil]: ចក្ខុទិព្វទម្លុះមហាសមុទ្រទី៣ - Divine Eye Gamma active";
        if (map) map.setView([10.6256, 103.5234], 12);
    }

    // Local Map Routing Triggers
    if (action === "scan_ocean") {
        drawRadarRoute({ lat: 10.6256, lng: 103.5234 }, { lat: 10.5000, lng: 103.4000 }, "រ៉ាដាសមុទ្រកំពង់សោម");
    } else if (action === "scan_border") {
        drawRadarRoute({ lat: 13.6580, lng: 102.5630 }, { lat: 13.7000, lng: 102.6000 }, "រ៉ាដាការពារព្រំដែន");
    } else if (action === "market_route") {
        drawRadarRoute({ lat: 11.5700, lng: 104.9180 }, { lat: 11.5690, lng: 104.9215 }, "គន្លងផ្លូវផ្សារថ្មី");
    }

    // Self Healing
    if (action === "simulate_fault") {
        systemState.healthLevels.agri = 30;
        systemState.healthLevels.health = 45;
        logger.write("⚠️ [warning]: រកឃើញការខូចខាតប្រព័ន្ធរង! botany: 30% | healthcare: 45%", "#ef4444");
        updateHealthUI();
    } else if (action === "auto_heal") {
        logger.write("♻️ [auto-heal]: កំពុងចាប់ផ្តើមចាក់បញ្ចូល dynamic repair scripts...", "#06b6d4");
        setTimeout(() => {
            systemState.healthLevels.agri = 100;
            systemState.healthLevels.health = 100;
            updateHealthUI();
            logger.write("✅ [auto-heal]: ប្រព័ន្ធរងទាំងអស់ត្រូវបានជួសជុល និងស្តារឡើងវិញដល់ ១០០% ជោគជ័យ!", "#10b981");
        }, 800);
    } else if (action === "clear_logs") {
        logger.clear();
    } else if (action === "fetch_room_two") {
        const roomcontent = document.getElementById("roomtwocontent");
        if (roomcontent) roomcontent.innerHTML = "<span class='text-yellow-400'>📂 core_369.dat | shield_v2.conf | revenue_401.log</span>";
        logger.write("🏛️ [workstation]: បានបើកឯកសារបន្ទប់ទី ២ រួចរាល់។", "gold");
    }

    if (action === "backup_now") {
        logger.write("💾 [backup]: កំពុងធ្វើការថតចម្លងទិន្នន័យពិតប្រាកដ...", "#eab308");
    }

    // Fire generic socket command
    socket.emit('execute_command', { action: action });
};

// 6. System Initialization
window.addEventListener("load", () => {
    setInterval(() => {
        const clockel = document.getElementById("clock");
        if (clockel) clockel.innerText = "CELESTIAL TIME: " + new Date().toLocaleString();

        const cctvtimer = document.getElementById("cctvtimer");
        if (cctvtimer) cctvtimer.innerText = new Date().toLocaleTimeString();
    }, 1000);

    initMahanokorMap();
    initMediaDevices();
    populateTables();

    // Chart.js
    const chartel = document.getElementById("revenuechart");
    if (chartel && typeof Chart !== 'undefined') {
        const ctx = chartel.getContext("2d");
        new Chart(chartel, {
            type: "line",
            data: {
                labels: ["jan", "feb", "mar", "apr", "may", "jun"],
                datasets: [{
                    label: "ប្រព័ន្ធចំណូលរួម",
                    data: [15, 25, 12, 19, 32, 45],
                    borderColor: "#06b6d4",
                    backgroundColor: "rgba(6, 182, 212, 0.2)",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    logger.write("👑 [core]: ផ្ទាំងបញ្ជាមហានគរ ៣៦៩ ដំណើរការជោគជ័យ ១០០%");
});
