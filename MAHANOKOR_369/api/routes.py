from flask import Blueprint, jsonify, request

# បង្កើត API Blueprint
api_bp = Blueprint('api_bp', __name__)

@api_bp.route('/status', methods=['GET'])
def system_status():
    """ API សម្រាប់ឆែកមើលថាតើប្រព័ន្ធដំណើរការឬអត់ """
    return jsonify({
        "status": "online",
        "system": "MAHANOKOR 369",
        "version": "9.0",
        "message": "Supreme Command is Active"
    }), 200

@api_bp.route('/metrics', methods=['POST'])
def update_metrics():
    """ API សម្រាប់ទទួលទិន្នន័យ (កម្តៅ, ថ្ម) ពីឧបករណ៍ C++ ខាងក្រៅ """
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    # ទីនេះយើងអាចសរសេរកូដបញ្ចូលទិន្នន័យទៅ Database តាមក្រោយ
    return jsonify({"status": "received", "data": data}), 200
