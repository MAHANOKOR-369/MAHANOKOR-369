from flask import Flask, render_template, jsonify, request
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

# System Initializations (បើកដំណើរការម៉ាស៊ីនទាំងអស់)
system_core = Mahanokor369Core()
security_matrix = ImperialSecurityMatrix()
ai_engine = AIGovernanceEngine()
gps_service = MahanokorGPSEngine()
energy_service = EnergyGridController()
air_command = AirCommandInterface()

# ១. បញ្ជូនទំព័រ Interface ទៅកាន់ Browser
@app.route('/')
def home():
    """ទំព័រដើម Dashboard Overview (Mahanokor Empire 369 Central Hub)"""
    return render_template('dashboard.html')

# ២. API សម្រាប់ពិនិត្យស្ថានភាពប្រព័ន្ធទាំងអស់ Real-time (ទាញទិន្នន័យពិត)
@app.route('/api/system-status', methods=['GET'])
def get_full_system_status():
    # ទាញយកទីតាំង GPS ពិតពី Module
    gps_data = gps_service.get_live_coordinates("EMPIRE-CORE-01")
    
    return jsonify({
        "core_status": "🟢 SYSTEM ONLINE - PHASE 1 TO 30 ACTIVE",
        "security_level": "MAXIMUM_DEFENSE",
        "gps_matrix": {
            "latitude": f"{gps_data.get('latitude', '11.5564')}° N",
            "longitude": f"{gps_data.get('longitude', '104.9282')}° E",
            "signal": gps_data.get('signal_strength', '100%')
        },
        "energy_grid": energy_service.monitor_power_distribution(),
        "ai_governance": ai_engine.ai_status,
        "time": str(datetime.datetime.now().isoformat())
    })

# ៣. API សម្រាប់ទទួលការបញ្ជាកំពូលពីមេបញ្ជាការ
@app.route('/api/execute-command', methods=['POST'])
def execute_empire_command():
    data = request.get_json() or {}
    master_key = data.get("master_key", "")
    phase_num = data.get("phase", 30)
    command = data.get("command", "SYSTEM_CHECK")

    # អនុញ្ញាតកូដ 369 ឬកូដ Master Key ដើម
    if master_key == "369" or master_key == "906.106.905":
        # ឆ្លងកាត់ការផ្ទៀងផ្ទាត់ដោយ Core System ពិតប្រាកដ
        result = system_core.execute_phase_command(phase_num, command, master_key)
        
        return jsonify({
            "status": "success", 
            "message": f"ACCESS GRANTED. COMMAND '{command}' EXECUTED. {result.get('message', '')}",
            "core_response": result
        })
    else:
        return jsonify({
            "status": "error", 
            "message": "ACCESS DENIED. INVALID MASTER KEY!"
        })

# ៤. API បញ្ជាប្រព័ន្ធអាកាសចរណ៍ (Phase 13-15)
@app.route('/api/air-command/deploy', methods=['POST'])
def deploy_air_assets():
    data = request.get_json() or {}
    aircraft_id = data.get("aircraft_id", "HYPERSONIC-369-ALPHA")
    mission = data.get("mission", "GLOBAL_PEACEKEEPING")
    
    deployment_info = air_command.deploy_aircraft_mission(aircraft_id, mission)
    return jsonify(deployment_info)

if __name__ == '__main__':
    # រត់ម៉ាស៊ីន Server លើ Port 5000 សម្រាប់ចូលមើល
    app.run(host='0.0.0.0', port=5000, debug=True)
