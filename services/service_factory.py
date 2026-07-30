# services/service_factory.py
from core.mahanokor_core_system import Mahanokor369Core
from core.mahanokor_security_matrix import ImperialSecurityMatrix
from core.ai_governance_engine import AIGovernanceEngine
from services.gps_tracking_service import MahanokorGPSEngine
from services.energy_grid_controller import EnergyGridController
from services.air_command_interface import AirCommandInterface

class ServiceContainer:
    """គ្រប់គ្រង Service Instances ឱ្យនៅដាច់ដោយឡែកពីគ្នា (Decoupled Dependency Injection)"""
    def __init__(self):
        self.core = Mahanokor369Core()
        self.security = ImperialSecurityMatrix()
        self.ai = AIGovernanceEngine()
        self.gps = MahanokorGPSEngine()
        self.energy = EnergyGridController()
        self.air = AirCommandInterface()

_container_instance = None

def get_service_container():
    global _container_instance
    if _container_instance is None:
        _container_instance = ServiceContainer()
    return _container_instance

