import os
from werkzeug.security import generate_password_hash
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# កំណត់ទីតាំងរក្សាទុក Database (ហ្វូឌែល data)
os.makedirs('data', exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/mahanokor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# បង្កើត Table
class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

def setup_database():
    with app.app_context():
        db.create_all()
        print("[*] ជោគជ័យ: បានបង្កើតតារាង Database (Tables) រួចរាល់។")
        
        # កំណត់ Username និង Password ថ្មីនៅទីនេះ (ឧ. user: 123, pass: 123456)
        user = '123'
        password = '123456'
        
        if not AdminUser.query.filter_by(username=user).first():
            hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
            new_admin = AdminUser(username=user, password_hash=hashed_pw)
            db.session.add(new_admin)
            db.session.commit()
            print(f"[+] ជោគជ័យ: បានបង្កើតគណនី '{user}' ជាមួយលេខកូដ '{password}' រួចរាល់។")
        else:
            print(f"[-] គណនី '{user}' មានរួចហើយនៅក្នុងប្រព័ន្ធ។")

if __name__ == '__main__':
    setup_database()
