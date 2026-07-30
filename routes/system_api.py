from flask import Blueprint, jsonify, request
import datetime
from services.service_factory import get_service_container

system_bp = Blueprint('system_bp', __name__)

@system_bp.route('/system-status', methods=['GET'])
def get_full_system_status():
    try:
        services = get_service_container()
        gps_data = services.gps.get_live_coordinates("EMPIRE-CORE-01")
        
        return jsonify({
            "status": "success",
            "core_status": "🟢 SYSTEM ONLINE - PHASE 1 TO 30 ACTIVE",
            "security_level": "MAXIMUM_DEFENSE",
            "gps_matrix": {
                "latitude": f"{gps_data.get('latitude', '11.5564')}° N",
                "longitude": f"{gps_data.get('longitude', '104.9282')}° E",
                "signal": gps_data.get('signal_strength', '100%')
            },
            "energy_grid": services.energy.monitor_power_distribution(),
            "ai_governance": services.ai.ai_status,
            "time": str(datetime.datetime.now().isoformat())
        }), 200
    except Exception as err:
        # ការពារមិនឱ្យ UI Buttons គាំងពេល Backend មាន Error
        return jsonify({
            "status": "error",
            "message": "ពុំអាចទាញយកស្ថានភាពប្រព័ន្ធបានឡើយ",
            "error_details": str(err)
        }), 500

@system_bp.route('/execute-command', methods=['POST'])
def execute_empire_command():
    try:
        data = request.get_json() or {}
        master_key = data.get("master_key", "")
        phase_num = data.get("phase", 30)
        command = data.get("command", "SYSTEM_CHECK")

        services = get_service_container()

        # ផ្ទៀងផ្ទាត់ Key តាមរយៈ Security Matrix Component
        if services.security.validate_key(master_key):
            result = services.core.execute_phase_command(phase_num, command, master_key)
            return jsonify({
                "status": "success",
                "message": f"ACCESS GRANTED. COMMAND '{command}' EXECUTED.",
                "core_response": result
            }), 200
        else:
            return jsonify({
                "status": "unauthorized",
                "message": "ACCESS DENIED. INVALID MASTER KEY!"
            }), 401
    except Exception as err:
        return jsonify({
            "status": "error",
            "message": "បរាជ័យក្នុងការអនុវត្តបទបញ្ជា",
            "error_details": str(err)
        }), 500
