#include <iostream>
#include <fstream>
#include <string>
#include <thread>
#include <chrono>

// កម្មវិធីអានកម្តៅ CPU ម៉ាស៊ីនពិតប្រាកដ (សម្រាប់ Linux/Termux)
void readThermalZone() {
    while (true) {
        std::ifstream tempFile("/sys/class/thermal/thermal_zone0/temp");
        if (tempFile.is_open()) {
            std::string tempStr;
            getline(tempFile, tempStr);
            float tempC = std::stof(tempStr) / 1000.0;
            std::cout << "CORE_TEMP_OVERRIDE:" << tempC << std::endl;
            tempFile.close();
        } else {
            std::cerr << "CORE_ERROR: មិនអាចអាន Hardware Sensor បានទេ។" << std::endl;
        }
        std::this_thread::sleep_for(std::chrono::seconds(2));
    }
}

int main() {
    std::cout << "[MAHANOKOR 369] C++ Hardware Listener Started..." << std::endl;
    readThermalZone();
    return 0;
}
