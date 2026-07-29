import hashlib
import hmac
import time

class ImperialSecurityMatrix:
    def __init__(self):
        # Master Key Architecture (369 / 906.106.905 Protocol)
        self.__commander_identity = "KHOEM SOKSIVUTHA"
        self.__master_signature = "906.106.905"
        self.__security_level = "MAXIMUM_DEFENSE"
        
    def generate_command_token(self, command_payload):
        """បង្កើត Encryption Token សម្រាប់រាល់ការបញ្ជាទាំងអស់"""
        timestamp = str(int(time.time()))
        message = f"{command_payload}:{timestamp}".encode('utf-8')
        secret = self.__master_signature.encode('utf-8')
        token = hmac.new(secret, message, hashlib.sha256).hexdigest()
        return {"token": token, "timestamp": timestamp}

    def validate_command_integrity(self, command_payload, token, timestamp):
        """ផ្ទៀងផ្ទាត់ថាគ្មាននរណាម្នាក់អាចកែបន្លំ ឬបញ្ជាជំនួសបានឡើយ"""
        message = f"{command_payload}:{timestamp}".encode('utf-8')
        secret = self.__master_signature.encode('utf-8')
        expected_token = hmac.new(secret, message, hashlib.sha256).hexdigest()
        
        if hmac.compare_digest(expected_token, token):
            return True, "🟢 Authenticated: Security Clearance Verified."
        return False, "🛑 Security Alert: Unauthorized Command Interception Anti-Override Activated."

# --- Usage Testing ---
sec_system = ImperialSecurityMatrix()
cmd = "ACTIVATE_PHASE_15_AIR_DEFENSE"
auth_data = sec_system.generate_command_token(cmd)
print("Generated Token:", auth_data)
