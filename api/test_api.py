import requests
import json

# Local API base URL
BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test API health endpoint"""
    print("🔍 Testing API Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ API is healthy")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ API error: {response.status_code}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

def test_solar_calculation():
    """Test solar energy calculation"""
    print("\n☀️ Testing Solar Power Calculation...")
    
    test_data = {
        "irradiance": 800,     # W/m²
        "panel_area": 10,      # m²
        "efficiency": 0.15,    # 15%
        "temperature": 30      # °C
    }
    
    try:
        response = requests.post(f"{BASE_URL}/solar/calculate", json=test_data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Solar power calculated successfully")
            print(f"   Power Output: {result['data']['power_output_kw']} kW")
            print(f"   Daily Energy: {result['data']['daily_energy_kwh']} kWh")
            print(f"   Efficiency: {result['data']['efficiency_percentage']}%")
        else:
            print(f"❌ Solar calculation error: {response.status_code}")
            print(f"   Details: {response.text}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

def test_wind_calculation():
    """Test wind energy calculation"""
    print("\n💨 Testing Wind Power Calculation...")
    
    test_data = {
        "wind_speed": 8,        # m/s
        "rotor_diameter": 20,   # m
        "efficiency": 0.35,     # 35%
        "air_density": 1.225    # kg/m³
    }
    
    try:
        response = requests.post(f"{BASE_URL}/wind/calculate", json=test_data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Wind power calculated successfully")
            print(f"   Power Output: {result['data']['power_output_kw']} kW")
            print(f"   Daily Energy: {result['data']['daily_energy_kwh']} kWh")
            print(f"   Rotor Area: {result['data']['rotor_area_m2']} m²")
        else:
            print(f"❌ Wind calculation error: {response.status_code}")
            print(f"   Details: {response.text}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

def test_hybrid_calculation():
    """Test hybrid system calculation"""
    print("\n🔋 Testing Hybrid System Calculation...")
    
    test_data = {
        "solar_irradiance": 800,   # W/m²
        "wind_speed": 8,           # m/s
        "panel_area": 10,          # m²
        "rotor_diameter": 20       # m
    }
    
    try:
        response = requests.post(f"{BASE_URL}/hybrid/calculate", json=test_data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Hybrid system calculated successfully")
            print(f"   Total Power: {result['data']['total']['total_power_kw']} kW")
            print(f"   Daily Energy: {result['data']['total']['total_daily_energy_kwh']} kWh")
            print(f"   Solar Contribution: {result['data']['total']['solar_percentage']}%")
            print(f"   Wind Contribution: {result['data']['total']['wind_percentage']}%")
        else:
            print(f"❌ Hybrid calculation error: {response.status_code}")
            print(f"   Details: {response.text}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

def test_weather_simulation():
    """Test weather simulation"""
    print("\n🌤️ Testing Weather Simulation...")
    
    test_data = {
        "hours": 24
    }
    
    try:
        response = requests.post(f"{BASE_URL}/weather/simulation", json=test_data)
        if response.status_code == 200:
            result = response.json()
            solar_avg = sum(result['data']['solar_irradiance']) / len(result['data']['solar_irradiance'])
            wind_avg = sum(result['data']['wind_speed']) / len(result['data']['wind_speed'])
            print("✅ Weather simulation generated successfully")
            print(f"   Hours Simulated: {len(result['data']['time'])}")
            print(f"   Avg Solar Irradiance: {solar_avg:.1f} W/m²")
            print(f"   Avg Wind Speed: {wind_avg:.1f} m/s")
        else:
            print(f"❌ Weather simulation error: {response.status_code}")
            print(f"   Details: {response.text}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

def run_all_tests():
    """Run all test cases"""
    print("🚀 Running SolarWindSim API Tests")
    print("=" * 50)
    
    test_health_check()
    test_solar_calculation()
    test_wind_calculation()
    test_hybrid_calculation()
    test_weather_simulation()
    
    print("\n" + "=" * 50)
    print("✅ All tests completed")

if __name__ == "__main__":
    run_all_tests()
