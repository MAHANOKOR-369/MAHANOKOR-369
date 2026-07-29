import hashlib
import datetime

class Mahanokor369Core:
    def __init__(self, commander_name="KHOEM SOKSIVUTHA"):
        self.commander = commander_name
        self.master_key_hash = hashlib.sha256(b"906.106.905").hexdigest()
        self.current_phase = 3  # Current Active Phase: Development
        self.system_status = "OPERATIONAL"

    def verify_master_override(self, input_key):
        """ផ្ទៀងផ្ទាត់សិទ្ធិបញ្ជាកំពូល (Master Authorization)"""
        hashed_input = hashlib.sha256(input_key.encode()).hexdigest()
        if hashed_input == self.master_key_hash:
            return True, "🟢 Master Access Granted: Commander Verified."
        return False, "❌ Access Denied: Unauthorized Master Key."

    def execute_phase_command(self, phase_number, command_action, input_key):
        """ការបញ្ជាប្រតិបត្តិការតាម Phase នីមួយៗ"""
        is_auth, msg = self.verify_master_override(input_key)
        if not is_auth:
            return {"status": "FAILED", "message": msg}

        if phase_number > 15 or phase_number < 1:
            return {"status": "INVALID", "message": "Phase out of boundaries (1-15 only)."}

        # Log action execution
        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "commander": self.commander,
            "target_phase": phase_number,
            "action": command_action,
            "status": "EXECUTED"
        }
        
        return {
            "status": "SUCCESS",
            "details": log_entry,
            "message": f" Command '{command_action}' executed successfully under Phase {phase_number}."
        }

# --- Initialization Example ---
if __name__ == "__main__":
    app_core = Mahanokor369Core()
    print("Mahanokor 369 Core Initialized successfully.")
