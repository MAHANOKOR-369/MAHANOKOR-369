from flask import Flask, jsonify, request
import datetime

# ទាញយក Module ទាំងអស់ដែលបានបង្កើតមុននេះពី Folder core និង services
from core.mahanokor_core_system import Mahanokor369Core
from core.mahanokor_security_matrix import ImperialSecurityMatrix
from core.ai_governance_engine import AIGovernanceEngine
from services.gps_tracking_service import MahanokorGPSEngine
from services.energy_grid_controller import EnergyGridController
from services.air_command_interface import AirCommandInterface

# បង្កើតប្រព័ន្ធ Flask App
app = Flask(__name__)

# System Initializations
system_core = Mahanokor369Core()
security_matrix = ImperialSecurityMatrix()
ai_engine = AIGovernanceEngine()
gps_service = MahanokorGPSEngine()
energy_service = EnergyGridController()
air_command = AirCommandInterface()

@app.route('/')
def imperial_dashboard_home():
    """ទំព័រដើម Dashboard Overview (Mahanokor Empire 369 Central Hub)"""
    return jsonify({
        "empire_name": "MAHANOKOR 369 - AI EMPIRE",
        "commander": "KHOEM SOKSIVUTHA",
        "system_status": "ONLINE",
        "active_phases": "Phase 1 to Phase 15 Fully Integrated",
        "timestamp": datetime.datetime.now().isoformat(),
        "motto": "The Customer is the Empire's Greatest Asset."
    })

@app.route('/api/system-status', methods=['GET'])
def get_full_system_status():
    """API សម្រាប់ពិនិត្យស្ថានភាពប្រព័ន្ធទាំងអស់ Real-time"""
    return jsonify({
        "core_status": system_core.system_status,
        "current_phase": system_core.current_phase,
        "security_level": "MAXIMUM_DEFENSE",
        "gps_matrix": gps_service.get_live_coordinates("EMPIRE-CORE-01"),
        "energy_grid": energy_service.monitor_power_distribution(),
        "ai_governance": ai_engine.ai_status
    })

@app.route('/api/execute-command', methods=['POST'])
def execute_empire_command():
    """API សម្រាប់ទទួលការបញ្ជាកំពូលពីមេបញ្ជាការ (With Master Override Authorization)"""
    data = request.get_json() or {}
    master_key = data.get("master_key", "")
    phase_num = data.get("phase", 3)
    command = data.get("command", "SYSTEM_CHECK")

    # Verify Security
    result = system_core.execute_phase_command(phase_num, command, master_key)
    return jsonify(result)

@app.route('/api/air-command/deploy', methods=['POST'])
def deploy_air_assets():
    """API បញ្ជាប្រព័ន្ធអាកាសចរណ៍ និង Hypersonic Fleet (Phase 13-15)"""
    data = request.get_json() or {}
    aircraft_id = data.get("aircraft_id", "HYPERSONIC-369-ALPHA")
    mission = data.get("mission", "GLOBAL_PEACEKEEPING")
    
    deployment_info = air_command.deploy_aircraft_mission(aircraft_id, mission)
    return jsonify(deployment_info)

if __name__ == '__main__':
    # រត់ប្រព័ន្ធ Server
    app.run(host='0.0.0.0', port=5000, debug=True)
