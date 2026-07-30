# app.py
from flask import Flask, render_template, jsonify
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MAHANOKOR_CORE")

def create_app():
    app = Flask(__name__)
    
    # 1. Register Blueprints (បំបែក Route តាមកាតព្វកិច្ច)
    from routes.system_api import system_bp
    from routes.air_api import air_bp
    
    app.register_blueprint(system_bp, url_prefix='/api')
    app.register_blueprint(air_bp, url_prefix='/api/air-command')

    # 2. Main Dashboard Interface Route
    @app.route('/')
    def home():
        return render_template('dashboard.html')

    # 3. Global Exception Handler (ការពារ UI មិនឱ្យកកស្ទះ)
    @app.errorhandler(Exception)
    def handle_global_exception(e):
        logger.error(f"Unhandled System Error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "ប្រព័ន្ធបានជួបប្រទះការរំខានបច្ចេកទេស។ សូមព្យាយាមម្តងទៀត!",
            "details": str(e)
        }), 500

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)

