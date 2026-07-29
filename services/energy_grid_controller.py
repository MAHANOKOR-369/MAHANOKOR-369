import random
import datetime

class EnergyGridController:
    def __init__(self):
        self.system_id = "POWER-GRID-369"
        self.energy_sources = ["SOLAR_MATRIX", "WIND_TURBINE", "HYDROGEN_CELL", "WIRELESS_POWER_TOWER"]
        self.grid_status = "OPTIMAL"

    def monitor_power_distribution(self):
        """ត្រួតពិនិត្យ និងចែកចាយថាមពល Real-time គ្មានការភាយឧស្ម័នពុល (Zero-Emission)"""
        current_capacity = round(random.uniform(95.0, 99.9), 2)
        load_balance = round(random.uniform(40.0, 75.0), 2)
        
        return {
            "timestamp": datetime.datetime.now().isoformat(),
            "grid_id": self.system_id,
            "capacity_percentage": f"{current_capacity}%",
            "load_balance": f"{load_balance}%",
            "wireless_power_status": "ACTIVE_TRANSMITTING",
            "carbon_emission": "0.00% (ZERO-EMISSION)"
        }

    def allocate_wireless_charge(self, target_vehicle_id):
        """បញ្ជូនថាមពលតាមអាកាស (Wireless Energy Beam) ទៅកាន់យានយន្ត ឬប្រព័ន្ធអាកាស"""
        return {
            "target": target_vehicle_id,
            "transfer_mode": "RESONANT_WIRELESS_POWER",
            "status": "CHARGING_IN_FLIGHT",
            "efficiency": "99.8%"
        }

# --- Quick Test ---
if __name__ == "__main__":
    energy_system = EnergyGridController()
    print("⚡ Energy Grid Active:", energy_system.monitor_power_distribution())
