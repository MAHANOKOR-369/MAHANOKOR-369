import os
from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# 1. ទាញយក Password ពីឯកសារ .env (លាក់កំបាំងពី Hacker)
load_dotenv()

app = Flask(__name__)
# ប្រើ Secret Key ពី .env ដើម្បីការពារ Session
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'fallback_secret_if_env_missing')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/mahanokor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 2. ដំឡើងខែលការពារ (Limiter) ចាប់ IP អ្នកវាយលុក
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

# បង្កើត Database និង User ដោយស្វ័យប្រវត្តិទាញពី .env
with app.app_context():
    db.create_all()
    master_user = os.getenv('MASTER_USERNAME')
    master_pass = os.getenv('MASTER_PASSWORD')
    
    if not AdminUser.query.filter_by(username=master_user).first():
        hashed_pw = generate_password_hash(master_pass, method='pbkdf2:sha256')
        db.session.add(AdminUser(username=master_user, password_hash=hashed_pw))
        db.session.commit()
        print(f"[🛡️ SECURITY] Master Account '{master_user}' Secured & Encrypted!")

# 3. មុខងារ Login សុវត្ថិភាពខ្ពស់ (កំណត់ត្រឹមវាយខុស 5 ដង ក្នុង 1 នាទី នឹងត្រូវប្លុក)
@app.route('/api/login', methods=['POST'])
@limiter.limit(os.getenv('MAX_LOGIN_ATTEMPTS', '5 per minute'))
def login():
    data = request.json
    password_attempt = data.get('password')
    master_user = os.getenv('MASTER_USERNAME')
    
    admin = AdminUser.query.filter_by(username=master_user).first()
    
    # ផ្ទៀងផ្ទាត់ Password ដែលបានបំប្លែង (Hash) 
    if admin and check_password_hash(admin.password_hash, password_attempt):
        session['logged_in'] = True
        return jsonify({"status": "success", "message": "ដោះសោជោគជ័យ!"})
    
    # បើវាយខុស វាត្រឡប់ Error 401 
    return jsonify({"status": "error", "message": "⚠️ លេខកូដសម្ងាត់ខុស! ព្យាយាមច្រើនដងនឹងត្រូវ Block IP!"}), 401

# រក្សាកូដ Route ផ្សេងៗរបស់បងនៅខាងក្រោមនេះដដែល...
