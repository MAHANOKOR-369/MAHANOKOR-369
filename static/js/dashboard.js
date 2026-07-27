// ===================================================
// MAHANOKOR 369 - MASTER JS (FULL INTEGRATED VERSION)
// ===================================================

const socket = io();

let map = null;
let currentRoutePolyline = null;
let currentMarker = null;
let mediaStream = null;

// ប្រព័ន្ធគ្រប់គ្រងសីតុណ្ហភាព និង Health Levels
let systemState = {
    cpuTemp: 14.2,
    healthLevels: { agri: 100, health: 100 }
};

// Logger Helper Screen
const logger = {
    write: function (msg, color = '#10b981') {
        const logBox = document.getElementById("logoutput");
        if (logBox) {
            const entry = document.createElement("div");
            entry.style.color = color;
            entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logBox.appendChild(entry);
            logBox.scrollTop = logBox.scrollHeight;
        }
    },
    clear: function () {
        const logBox = document.getElementById("logoutput");
        if (logBox) logBox.innerHTML = "";
    }
};

// 1. ស្នើសុំសិទ្ធិ កាមេរ៉ា និង មេក្រូ (Camera & Microphone Access)
async function initMediaDevices() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const videoElement = document.getElementById("cctvvideofeed");
        if (videoElement) {
            videoElement.srcObject = mediaStream;
            videoElement.play();
        }
        logger.write("🎥 [media]: បានទទួលសិទ្ធិប្រើប្រាស់កាមេរ៉ា និងមេក្រូជោគជ័យ!", "#06b6d4");
    } catch (err) {
        logger.write("⚠️ [media]: អ្នកប្រើប្រាស់មិនទាន់បានអនុញ្ញាតសិទ្ធិកាមេរ៉ា/មេក្រូ ឬគ្មាន Device!", "#ef4444");
    }
}

// 2. ផែនទី GPS រត់តាមផ្លូវពិត (OSRM Road Routing)
function initMahanokorMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    map = L.map('map').setView([11.5564, 104.9282], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Mahanokor 369 System'
    }).addTo(map);

    logger.write("🗺️ [map]: ផែនទីផ្កាយរណបរ៉ាដាត្រូវបានចាប់ផ្តើមជោគជ័យ។", "#06b6d4");
}

async function drawRadarRoute(startCoords, endCoords, labelText) {
    if (!map) return;

    if (currentRoutePolyline) map.removeLayer(currentRoutePolyline);
    if (currentMarker) map.removeLayer(currentMarker);

    logger.write(`🛣️ [gps]: កំពុងគណនាខ្សែផ្លូវថ្នល់ពិតប្រាកដសម្រាប់ ${labelText}...`, "#eab308");

    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
            const routeCoords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            currentRoutePolyline = L.polyline(routeCoords, { color: '#06b6d4', weight: 5, opacity: 0.8 }).addTo(map);
            currentMarker = L.marker([endCoords.lat, endCoords.lng]).addTo(map).bindPopup(labelText).openPopup();
            map.fitBounds(currentRoutePolyline.getBounds());
            logger.write(`✅ [gps]: បានគូរខ្សែផ្លូវតាមផ្លូវថ្នល់សម្រាប់ ${labelText} រួចរាល់!`, "#10b981");
        } else {
            throw new Error("No route");
        }
    } catch (e) {
        const fallbackCoords = [[startCoords.lat, startCoords.lng], [endCoords.lat, endCoords.lng]];
        currentRoutePolyline = L.polyline(fallbackCoords, { color: '#f59e0b', weight: 4, dashArray: '5, 10' }).addTo(map);
        currentMarker = L.marker([endCoords.lat, endCoords.lng]).addTo(map).bindPopup(labelText).openPopup();
        map.fitBounds(currentRoutePolyline.getBounds());
        logger.write(`⚠️ [gps]: បង្ហាញខ្សែបន្ទាត់ផ្លូវសម្រាប់ ${labelText}`, "#f59e0b");
    }
}

// 3. UI Update Helpers
function updateHealthUI() {
    const agriText = document.getElementById("healthagri");
    const agriBar = document.getElementById("baragri");
    const healthText = document.getElementById("healthhealth");
    const healthBar = document.getElementById("barhealth");

    if (agriText && agriBar) {
        agriText.innerText = systemState.healthLevels.agri + "%";
        agriBar.style.width = systemState.healthLevels.agri + "%";
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

// 4. WebSocket Hardware Telemetry & Command Responses
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

socket.on('command_response', function(data) {
    logger.write(`⚡ [ai-core]: ប្រតិបត្តិការ ${data.action} ជោគជ័យ | time: ${data.timestamp}`, "#eab308");
});

// 5. Voice Command (Web Speech API) Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

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
}

function startVoiceCommand() {
    if (recognition) {
        logger.write("🎙️ [voice]: AI កំពុងស្តាប់... (សូមនិយាយ 'Lock System' ឬ 'Scan Network')", "#00bfff");
        recognition.start();
    } else {
        logger.write("⚠️ Browser របស់អ្នកមិនគាំទ្រមុខងារបញ្ជាដោយសំឡេងទេ។", "#ef4444");
    }
}

// 6. Master Command Triggers
window.customtrigger = function (action) {
    const montext = document.getElementById("monitortext");

    if (action === "quantum_voice") {
        startVoiceCommand();
        return;
    }

    if (action === "request_media_permission") {
        initMediaDevices();
    }
    // --- Sigil & Divine Eyes ---
    else if (action === "sigil_eye_1") {
        if (montext) montext.innerHTML = "[sigil]: ចក្ខុទិព្វស្កេនលំហអាកាសទី១ - Divine Eye Alpha active";
        logger.write("👁️ [sigil]: បានបញ្ចេញអំណាចមហាភ្នែកទី១ ស្កេនទីក្រុងភ្នំពេញជោគជ័យ។", "#14b8a6");
        if (map) map.setView([11.5564, 104.9282], 14);
    } else if (action === "sigil_eye_2") {
        if (montext) montext.innerHTML = "[sigil]: ចក្ខុទិព្វឆ្លុះផ្ទៃមេឃទី២ - Divine Eye Beta active";
        logger.write("👁️ [sigil]: បានបញ្ចេញអំណាចមហាភ្នែកទី២ ឆ្លុះទិសដៅមេឃជោគជ័យ។", "#14b8a6");
        if (map) map.setView([13.3633, 103.8564], 12);
    } else if (action === "sigil_eye_3") {
        if (montext) montext.innerHTML = "[sigil]: ចក្ខុទិព្វទម្លុះមហាសមុទ្រទី៣ - Divine Eye Gamma active";
        logger.write("👁️ [sigil]: បានបញ្ចេញអំណាចមហាភ្នែកទី៣ ស្កេនបាតសមុទ្រជោគជ័យ។", "#14b8a6");
        if (map) map.setView([10.6256, 103.5234], 12);
    } else if (action === "sigil_core") {
        if (montext) montext.innerHTML = "[sigil]: កាំរស្មីថាមពលព្រះអាទិត្យ - Almighty Core active";
        logger.write("☀️ [sigil]: មហាចក្រថាមពលព្រះអាទិត្យត្រូវបានបើកដំណើរការ ១០០%។", "#eab308");
    } else if (action === "sigil_code") {
        if (montext) montext.innerHTML = "[sigil]: បណ្តាញខ្យល់ព្យុះទិន្នន័យ - Supreme Code running";
        logger.write("🌀 [sigil]: ស្តេចកូដស្វ័យបញ្ជូនទិន្នន័យគ្មានកំហុស។", "#a855f7");
    } else if (action === "sigil_main") {
        if (montext) montext.innerHTML = "[sigil]: ម៉ាស៊ីនបម្រើការកណ្តាល - Main Core connected";
        logger.write("🌐 [sigil]: ភ្ជាប់ទំនាក់ទំនងជាមួយប្រព័ន្ធមេជោគជ័យ។");
    } else if (action === "sigil_destiny") {
        if (montext) montext.innerHTML = "[sigil]: ពិធីការកែប្រែខ្សែព្រលឹង - Destiny Node engaged";
        logger.write("☸️ [sigil]: កែប្រែខ្សែវាសនាប្រព័ន្ធមហានគរបានសម្រេចជោគជ័យ។", "#eab308");
    }

    // --- CCTV Controls ---
    else if (action.startsWith("cctv_")) {
        const cctvid = document.getElementById("cctvid");
        const cctvstatus = document.getElementById("cctvstatus");
        const cctvloc = document.getElementById("cctvloctext");
        if (action === "cctv_pp") {
            if (cctvid) cctvid.innerHTML = "cam-01 [hq]";
            if (cctvstatus) cctvstatus.innerHTML = "status: secured (100%)";
            if (cctvloc) cctvloc.innerHTML = "<span class='animate-pulse mr-2'>🟢</span> phnom penh (hq)";
            logger.write("🎥 [cctv]: បានប្តូរទៅកាន់ប៉ុស្តិ៍ទីស្នាក់ការកណ្តាល ភ្នំពេញ (hq)", "#06b6d4");
        } else if (action === "cctv_pp_border") {
            if (cctvid) cctvid.innerHTML = "cam-02 [border]";
            if (cctvstatus) cctvstatus.innerHTML = "status: boundary monitoring";
            if (cctvloc) cctvloc.innerHTML = "<span class='animate-pulse mr-2'>🟡</span> poipet border area";
            logger.write("🎥 [cctv]: បានប្តូរទៅកាន់ប៉ុស្តិ៍តាមដានសន្តិសុខព្រំដែន ប៉ោយប៉ែត", "#06b6d4");
        } else if (action === "cctv_pv") {
            if (cctvid) cctvid.innerHTML = "cam-03 [hub]";
            if (cctvstatus) cctvstatus.innerHTML = "status: logistics flow active";
            if (cctvloc) cctvloc.innerHTML = "<span class='animate-pulse mr-2'>🟢</span> prey veng distribution";
            logger.write("🎥 [cctv]: បានប្តូរទៅកាន់ប៉ុស្តិ៍តាមដានឃ្លាំងទិន្នន័យ ព្រៃវែង", "#06b6d4");
        } else if (action === "cctv_coastal") {
            if (cctvid) cctvid.innerHTML = "cam-04 [coastal]";
            if (cctvstatus) cctvstatus.innerHTML = "status: marine sensor stream";
            if (cctvloc) cctvloc.innerHTML = "<span class='animate-pulse mr-2'>🔵</span> sihanoukville ocean line";
            logger.write("🎥 [cctv]: បានប្តូរទៅកាន់ប៉ុស្តិ៍តាមដានផ្ទៃសមុទ្រ និងកំពង់ផែ", "#06b6d4");
        }
    }

    // --- GPS Routes ---
    else if (action === "scan_ocean") {
        logger.write("🌊 [marine]: ចាប់ផ្តើមស្កេនទិន្នន័យ និងសីតុណ្ហភាពផ្ទៃសមុទ្រ...", "#0284c7");
        drawRadarRoute({ lat: 10.6256, lng: 103.5234 }, { lat: 10.5000, lng: 103.4000 }, "រ៉ាដាសមុទ្រកំពង់សោម");
    } else if (action === "scan_border") {
        logger.write("🛡️ [security]: កំពុងស្កេនរន្ធស្រមោល និងខ្សែការពារព្រំដែន...", "#f43f5e");
        drawRadarRoute({ lat: 13.6580, lng: 102.5630 }, { lat: 13.7000, lng: 102.6000 }, "រ៉ាដាការពារព្រំដែន");
    } else if (action === "market_route") {
        logger.write("🏁 [intelligence]: កំពុងទាញទិន្នន័យគន្លងផ្លូវផ្សារថ្មី...", "#eab308");
        drawRadarRoute({ lat: 11.5700, lng: 104.9180 }, { lat: 11.5690, lng: 104.9215 }, "គន្លងផ្លូវផ្សារថ្មី");
    }

    // --- Weather Scanner ---
    else if (action === "scan_weather_level_1") {
        logger.write("📡 [weather]: កំពុងស្កេនរ៉ាដាអាកាសធាតុកម្រិត ១...", "#ff3366");
        if (map) map.setView([12.5, 105.0], 7);
    } else if (action === "scan_weather_level_2") {
        logger.write("🌀 [weather]: កំពុងស្កេនរ៉ាដាអាកាសធាតុកម្រិត ២...", "#bc13fe");
        if (map) map.setView([10.5, 103.5], 9);
    }

    // --- Workstation Controls ---
    else if (action === "safe_config") {
        logger.write("⚙️ [config]: កំពុងផ្ទុកទិន្នន័យ config.js... app_name: 'mahanokor 369' | version: '9.0'", "#10b981");
    } else if (action === "safe_logs") {
        logger.write("📊 [logs]: កំពុងត្រួតពិនិត្យកំណត់ហេតុប្រព័ន្ធទាំងអស់... សន្តិសុខ: ok | កាមេរ៉ា: ok");
    } else if (action === "status_check") {
        logger.write("⚡ [ping]: កំពុងត្រួតពិនិត្យល្បឿនបណ្តាញ... ping: 12ms | jitter: 1.2ms | status: online", "#10b981");
    } else if (action === "backup_now") {
        logger.write("💾 [backup]: ចាប់ផ្តើមរក្សាទុក snapshots...", "#eab308");
        setTimeout(() => { logger.write("💾 [backup]: បានចម្លង និងរក្សាទុកទិន្នន័យបម្រុងដោយជោគជ័យ ១០០%!", "#10b981"); }, 600);
    } else if (action === "lock_system") {
        document.getElementById("lockscreen").classList.remove("hidden");
        logger.write("🔒 [security]: ប្រព័ន្ធត្រូវបានចាក់សោសុវត្ថិភាព!", "#ef4444");
    } else if (action === "unlock_system") {
        const pass = document.getElementById("masterkey").value;
        if (pass === "369" || pass === "369400401") {
            document.getElementById("lockscreen").classList.add("hidden");
            document.getElementById("lockerrormsg").classList.add("hidden");
            logger.write("🔓 [security]: ដោះសោប្រព័ន្ធជោគជ័យ!", "#10b981");
        } else {
            document.getElementById("lockerrormsg").classList.remove("hidden");
        }
    }

    // --- Self-Healing ---
    else if (action === "simulate_fault") {
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
    }

    // --- Scanners & Quantum ---
    else if (action === "scan_net") { logger.write("🌐 [scanner]: កំពុងស្កេនប្រព័ន្ធ Network ជុំវិញ៖ សុវត្ថិភាព [OK]", "#26ff26"); }
    else if (action === "scan_cable") { logger.write("🔌 [scanner]: ស្កេនចរន្តពន្លឺ Fiber Optic៖ ល្បឿនពេញលេញ", "#26ff26"); }
    else if (action === "scan_wireless") { logger.write("⚡ [scanner]: ស្កេនរលកសញ្ញាឥតខ្សែ Bluetooth & WiFi៖ គ្មានការលួចស្តាប់", "#26ff26"); }
    else if (action === "scan_power") { logger.write("💡 [scanner]: ស្កេននិងគ្រប់គ្រងប្រព័ន្ធចរន្តអគ្គិសនី Power Grid៖ ស្ថិរភាព", "#26ff26"); }
    else if (action === "scan_aerospace") { logger.write("🌌 [scanner]: ស្កេននិងបិទច្រកលំហអាកាស Aerospace Frequency៖ ធម្មតា", "#26ff26"); }
    else if (action === "scan_dark") { logger.write("👁️‍🗨️ [scanner]: ស្កេនរកឃើញក្រុមភ្លើងងងឹត (ពួកលួចលុយ)៖ ត្រូវបានកម្ទេចចោល!", "#ff3333"); }
    else if (action === "quantum_admin") { logger.write("🔐 [admin auth]: ផ្ទៀងផ្ចាត់គណនីគ្រប់គ្រងជាន់ខ្ពស់...", "gold"); }
    else if (action === "quantum_init") { logger.write("⚙️ [quantum]: initialize core activated", "#ff00ff"); }
    else if (action === "quantum_shield") { logger.write("🛡️ [quantum]: quantum energize shield active", "#ff00ff"); }
    else if (action === "fetch_room_two") {
        const roomcontent = document.getElementById("roomtwocontent");
        if (roomcontent) roomcontent.innerHTML = "<span class='text-yellow-400'>📂 core_369.dat | shield_v2.conf | revenue_401.log</span>";
        logger.write("🏛️ [workstation]: បានបើកឯកសារបន្ទប់ទី ២ រួចរាល់។", "gold");
    }

    // បាញ់បញ្ជាទៅ Backend តាម Socket.io
    socket.emit('execute_command', { action: action });
};

// 7. System Load Initializer
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
