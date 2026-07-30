import json
from typing import Dict, Any

class MahanokorBlueprintManager:
    def __init__(self, config_path: str = "mahanokor_phase28_30.json"):
        with open(config_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)

    def get_phase_systems(self, phase_number: int) -> Dict[str, Any]:
        """ទាញយកប្រព័ន្ធទាំងពីរ (System A & System B) តាមលេខ Phase"""
        phase_key = str(phase_number)
        if phase_key in self.data["phases"]:
            return self.data["phases"][phase_key]
        return {"error": f"Phase {phase_number} មិនទាន់មានក្នុងប្រព័ន្ធ"}

    def list_all_modules(self, phase_number: int):
        """បង្ហាញមុខងារទាំងអស់ (សរុបទាំង ២ ប្រព័ន្ធ) ក្នុង Phase មួយ"""
        systems = self.get_phase_systems(phase_number)
        if "error" in systems:
            print(systems["error"])
            return

        print(f"=== 📊 របាយការណ៍មុខងារ PHASE {phase_number} ===")
        for sys_key, sys_info in systems.items():
            print(f"\n▶ [{sys_key.upper()}] {sys_info['title']} ({sys_info['category']})")
            print(f"   ចំនួនមុខងារ៖ {sys_info['total_modules']}")
            for mod in sys_info["modules"]:
                print(f"   - {mod}")

# --- ឧទាហរណ៍នៃការដកស្រង់ទិន្នន័យមកប្រើប្រាស់ ---
if __name__ == "__main__":
    manager = MahanokorBlueprintManager()
    
    # ទាញយកទិន្នន័យ Phase 28 មកបង្ហាញ
    manager.list_all_modules(28)
