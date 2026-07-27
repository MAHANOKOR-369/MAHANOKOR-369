import os
import cv2
import requests
import psutil
import numpy as np
import face_recognition
from flask import Flask, render_template, request, jsonify, Response, session
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# ==========================================
# 1. SYSTEM INITIALIZATION
# ==========================================
app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SECRET_KEY'] = 'mahanokor_369_super_secret_key'

# កំណត់ទីតាំង Database ពិតប្រាកដ ដើម្បីកុំឲ្យ Error នៅលើទូរសព្ទ (Termux)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'data', 'mahanokor.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DB_PATH
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# លុប async_mode='eventlet' ចេញ ដើម្បីដំណើរការបានដោយមិនគាំង
socketio = SocketIO(app, cors_allowed_origins="*") 

# ==========================================
# 2. DATABASE MODELS
# ==========================================
class SystemLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    action = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False)

class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

with app.app_context():
    os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)
    db.create_all()
    if not AdminUser.query.filter_by(username='admin369').first():
        hashed_pw = generate_password_hash('369400401', method='pbkdf2:sha256')
        db.session.add(AdminUser(username='admin369', password_hash=hashed_pw))
        db.session.commit()

# ==========================================
# 3. FACIAL RECOGNITION SETUP
# ==========================================
try:
    owner_image = face_recognition.load_image_file("data/owner.jpg")
    owner_encoding = face_recognition.face_encodings(owner_image)[0]
    known_face_encodings = [owner_encoding]
    known_face_names = ["Deity Khoem Soksivutha"]
except:
    print("⚠️ មិនអាចស្វែងរករូបភាព data/owner.jpg បានទេ។ សូមពិនិត្យមើលម្ដងទៀត!")
    known_face_encodings = []
    known_face_names = []

def generate_camera_frames():
    camera = cv2.VideoCapture(0)
    while True:
        success, frame = camera.read()
        if not success: break

        # បង្រួមទំហំរូបភាពដើម្បីឲ្យ AI ដំណើរការរហ័ស
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "UNKNOWN: ACCESS DENIED"
            color = (0, 0, 255) # ពណ៌ក្រហមសម្រាប់អ្នកមិនស្គាល់មុខ

            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]
                color = (0, 255, 0) # ពណ៌បៃតងសម្រាប់ម្ចាស់ប្រព័ន្ធ

            top *= 4; right *= 4; bottom *= 4; left *= 4
            cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
            cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_camera_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# ==========================================
# 4. HARDWARE TELEMETRY THREAD (CPU & RAM)
# ==========================================
def telemetry_thread():
    while True:
        socketio.sleep(1) # ផ្អាក 1 វិនាទីមុនទាញយកទិន្នន័យថ្មី
        cpu_usage = psutil.cpu_percent(interval=None)
        ram_usage = psutil.virtual_memory().percent
        socketio.emit('hardware_telemetry', {'cpu': cpu_usage, 'ram': ram_usage})

@socketio.on('connect')
def handle_connect():
    socketio.start_background_task(telemetry_thread)
    emit('system_alert', {'message': 'ម៉ាស៊ីនកណ្តាល បានភ្ជាប់ទំនាក់ទំនង (100%)', 'color': '#10b981'})

# ==========================================
# 5. SECURE AUTH & COMMANDS
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    admin = AdminUser.query.filter_by(username='admin369').first()
    if admin and check_password_hash(admin.password_hash, data.get('password')):
        session['logged_in'] = True
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "លេខកូដសម្ងាត់ខុស!"}), 401

@socketio.on('execute_command')
def handle_command(data):
    action = data.get('action')
    new_log = SystemLog(action=action, status='EXECUTED')
    db.session.add(new_log)
    db.session.commit()
    emit('command_response', {'action': action, 'timestamp': datetime.utcnow().strftime('%H:%M:%S')}, broadcast=True)

# ==========================================
# 6. ROUTES
# ==========================================
@app.route('/')
@app.route('/dashboard')
def dashboard(): 
    return render_template('dashboard.html')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
