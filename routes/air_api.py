# routes/air_api.py
from flask import Blueprint, jsonify, request
from services.service_factory import get_service_container

air_bp = Blueprint('air_bp', __name__)

@air_bp.route('/deploy', methods=['POST'])
def deploy_air_assets():
    try:
        data = request.get_json() or {}
        aircraft_id = data.get("aircraft_id", "HYPERSONIC-369-ALPHA")
        mission = data.get("mission", "GLOBAL_PEACEKEEPING")
        
        services = get_service_container()
        deployment_info = services.air.deploy_aircraft_mission(aircraft_id, mission)
        
        return jsonify({
            "status": "success",
            "data": deployment_info
        }), 200
    except Exception as err:
        return jsonify({
            "status": "error",
            "message": "បរាជ័យក្នុងការបញ្ជាប្រព័ន្ធអាកាសចរណ៍",
            "error_details": str(err)
        }), 500
