import json
import logging
from datetime import datetime
from enum import Enum
from typing import Dict, List, Any, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")

class ModuleStatus(Enum):
    STANDBY = "STANDBY"
    ONLINE = "ONLINE"
    PROCESSING = "PROCESSING"
    OPTIMIZED = "OPTIMIZED"
    ALERT = "ALERT"

class MahanokorSystemEngine:
    def __init__(self, project_name: str = "MAHANOKOR 369"):
        self.project_name = project_name
        self.version = "3.0.0-PRO"
        self.system_registry: Dict[int, Dict[str, Any]] = self._build_master_registry()
        
    def _build_master_registry(self) -> Dict[int, Dict[str, Any]]:
        """បង្កើត Data Registry ពេញលេញនៃ Phase 28, 29, 30 ដោយមិនរំលងមួយមុខងារ"""
        return {
            28: {
                "system_a": {
                    "title": "AI INFRASTRUCTURE BUILDER SYSTEM",
                    "code": "M369-SYS-28A",
                    "category": "Heavy Construction & Automation",
                    "modules": {
                        "MOD-28A-01": {"name": "AI Command Center", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-28A-02": {"name": "Smart Bridge Engineering", "status": ModuleStatus.STANDBY, "health": 98},
                        "MOD-28A-03": {"name": "Smart Road Construction", "status": ModuleStatus.PROCESSING, "health": 95},
                        "MOD-28A-04": {"name": "AI Earth Leveling Machine", "status": ModuleStatus.ONLINE, "health": 99},
                        "MOD-28A-05": {"name": "Smart Tunnel System", "status": ModuleStatus.STANDBY, "health": 97},
                        "MOD-28A-06": {"name": "Solar LED Smart Lighting", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-28A-07": {"name": "Water Drainage & Flood Control", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-28A-08": {"name": "Geological & Soil Analysis AI", "status": ModuleStatus.OPTIMIZED, "health": 99},
                        "MOD-28A-09": {"name": "Autonomous Construction Robots", "status": ModuleStatus.ONLINE, "health": 96},
                        "MOD-28A-10": {"name": "Emergency Rescue & Medical Unit", "status": ModuleStatus.STANDBY, "health": 100},
                        "MOD-28A-11": {"name": "Environmental Protection AI", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-28A-12": {"name": "Digital Infrastructure Dashboard", "status": ModuleStatus.ONLINE, "health": 100}
                    }
                },
                "system_b": {
                    "title": "DIGITAL NATURE FOOD CREATOR",
                    "code": "M369-SYS-28B",
                    "category": "Sustainable Agriculture & Biology",
                    "modules": {
                        "MOD-28B-01": {"name": "AI Smart Farm Module", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-28B-02": {"name": "Digital Food Production", "status": ModuleStatus.PROCESSING, "health": 97},
                        "MOD-28B-03": {"name": "Digital Supply Chain", "status": ModuleStatus.ONLINE, "health": 99},
                        "MOD-28B-04": {"name": "AI Food Analysis Lab", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-28B-05": {"name": "Food Distribution Unit", "status": ModuleStatus.ONLINE, "health": 98},
                        "MOD-28B-06": {"name": "Digital Control Center", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-28B-07": {"name": "System Architecture Flow", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-28B-08": {"name": "Technical Specifications", "status": ModuleStatus.ONLINE, "health": 100}
                    }
                }
            },
            29: {
                "system_a": {
                    "title": "AI PEACEKEEPING COMMAND VEHICLE",
                    "code": "M369-SYS-29A",
                    "category": "Intelligent Defense & Safety",
                    "modules": {
                        "MOD-29A-01": {"name": "AI Situation Analysis", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-29A-02": {"name": "Human Authorization Console", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29A-03": {"name": "Secure Communication System", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29A-04": {"name": "Satellite Backup System", "status": ModuleStatus.STANDBY, "health": 99},
                        "MOD-29A-05": {"name": "Mobile Medical Support", "status": ModuleStatus.ONLINE, "health": 98},
                        "MOD-29A-06": {"name": "Civilian Safety Recognition", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-29A-07": {"name": "Search & Rescue Drone Control", "status": ModuleStatus.PROCESSING, "health": 96},
                        "MOD-29A-08": {"name": "Command Operations Center", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29A-09": {"name": "Digital Mapping & Intelligence", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-29A-10": {"name": "Energy Management System", "status": ModuleStatus.ONLINE, "health": 99},
                        "MOD-29A-11": {"name": "Black Box Recorder", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29A-12": {"name": "AI Ethics & Safety Monitor", "status": ModuleStatus.OPTIMIZED, "health": 100}
                    }
                },
                "system_b": {
                    "title": "AI EMERGENCY HABITAT BUILDER",
                    "code": "M369-SYS-29B",
                    "category": "Disaster Relief & Shelter Creation",
                    "modules": {
                        "MOD-29B-01": {"name": "Rapid Deployment Unit", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29B-02": {"name": "Modular Shelter System", "status": ModuleStatus.STANDBY, "health": 100},
                        "MOD-29B-03": {"name": "Smart Living Space", "status": ModuleStatus.ONLINE, "health": 97},
                        "MOD-29B-04": {"name": "AI Population Management", "status": ModuleStatus.OPTIMIZED, "health": 99},
                        "MOD-29B-05": {"name": "Water & Sanitation Unit", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29B-06": {"name": "Medical Support Module", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29B-07": {"name": "Energy & Power Unit", "status": ModuleStatus.ONLINE, "health": 98},
                        "MOD-29B-08": {"name": "Communication Center", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29B-09": {"name": "Security & Safety Unit", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-29B-10": {"name": "Deployment Process", "status": ModuleStatus.STANDBY, "health": 100},
                        "MOD-29B-11": {"name": "Technical Specifications", "status": ModuleStatus.OPTIMIZED, "health": 100}
                    }
                }
            },
            30: {
                "system_a": {
                    "title": "AI INFRASTRUCTURE RECOVERY SYSTEM",
                    "code": "M369-SYS-30A",
                    "category": "Rebuild & Infrastructure Recovery",
                    "modules": {
                        "MOD-30A-01": {"name": "Automatic Road Repair", "status": ModuleStatus.STANDBY, "health": 95},
                        "MOD-30A-02": {"name": "Bridge Inspection Robot", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30A-03": {"name": "Water Supply Recovery", "status": ModuleStatus.PROCESSING, "health": 98},
                        "MOD-30A-04": {"name": "Power Grid Restoration", "status": ModuleStatus.ONLINE, "health": 99},
                        "MOD-30A-05": {"name": "Communication Network Repair", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30A-06": {"name": "Smart Construction AI", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-30A-07": {"name": "Mobile Control Room", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30A-08": {"name": "Materials & Equipment Storage", "status": ModuleStatus.ONLINE, "health": 97},
                        "MOD-30A-09": {"name": "Maintenance Robot Unit", "status": ModuleStatus.PROCESSING, "health": 96},
                        "MOD-30A-10": {"name": "Environmental Monitoring", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-30A-11": {"name": "Mission Analytics", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-30A-12": {"name": "Central AI Dashboard", "status": ModuleStatus.ONLINE, "health": 100}
                    }
                },
                "system_b": {
                    "title": "LIFE ENERGY PROVIDER SYSTEM",
                    "code": "M369-SYS-30B",
                    "category": "Clean Energy, Water & Life Support",
                    "modules": {
                        "MOD-30B-01": {"name": "Solar Energy System", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30B-02": {"name": "Water Generation System", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-30B-03": {"name": "Water Distribution", "status": ModuleStatus.ONLINE, "health": 99},
                        "MOD-30B-04": {"name": "Life Support Energy", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30B-05": {"name": "Hot Water System", "status": ModuleStatus.STANDBY, "health": 98},
                        "MOD-30B-06": {"name": "Power For All Needs", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30B-07": {"name": "Eco Life Ecosystem", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-30B-08": {"name": "Animal & Nature Care", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30B-09": {"name": "AI Energy Management", "status": ModuleStatus.OPTIMIZED, "health": 100},
                        "MOD-30B-10": {"name": "Energy Flow Diagram", "status": ModuleStatus.ONLINE, "health": 100},
                        "MOD-30B-11": {"name": "Technical Specifications", "status": ModuleStatus.ONLINE, "health": 100}
                    }
                }
            }
        }

    def execute_system_audit(self, phase: int) -> Dict[str, Any]:
        """ត្រួតពិនិត្យសុខភាពប្រព័ន្ធ និងស្ថានភាពមុខងារទាំងអស់ក្នុង Phase"""
        if phase not in self.system_registry:
            raise ValueError(f"Phase {phase} រកមិនឃើញក្នុងប្រព័ន្ធទិន្នន័យ!")
        
        phase_data = self.system_registry[phase]
        audit_result = {
            "timestamp": datetime.now().isoformat(),
            "phase": phase,
            "systems": {}
        }
        
        for sys_key, sys_obj in phase_data.items():
            total_mods = len(sys_obj["modules"])
            online_mods = sum(1 for m in sys_obj["modules"].values() if m["status"] in [ModuleStatus.ONLINE, ModuleStatus.OPTIMIZED])
            avg_health = sum(m["health"] for m in sys_obj["modules"].values()) / total_mods
            
            audit_result["systems"][sys_key] = {
                "title": sys_obj["title"],
                "code": sys_obj["code"],
                "total_modules": total_mods,
                "active_modules": online_mods,
                "average_health": round(avg_health, 2),
                "modules_detail": sys_obj["modules"]
            }
            
        logging.info(f"ធ្វើសវនកម្មប្រព័ន្ធ Phase {phase} រួចរាល់ដោយជោគជ័យ!")
        return audit_result

# --- ដំណើរការសាកល្បង ---
if __name__ == "__main__":
    engine = MahanokorSystemEngine()
    
    # ធ្វើសវនកម្មលើ Phase 28, 29, 30
    for p in [28, 29, 30]:
        report = engine.execute_system_audit(p)
        print(f"\n==================== [ PHASE {p} AUDIT ] ====================")
        for sys_id, details in report["systems"].items():
            print(f"➜ [{details['code']}] {details['title']}")
            print(f"   ចំនួនមុខងារសរុប៖ {details['total_modules']} | សុខភាពមធ្យម៖ {details['average_health']}%")
