from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import math
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class SolarWindCalculator:
    @staticmethod
    def calculate_solar_power(irradiance, panel_area, efficiency=0.15, temperature=25):
        try:
            temp_correction = 1 - 0.004 * (temperature - 25)
            adjusted_efficiency = efficiency * temp_correction
            power_output = irradiance * panel_area * adjusted_efficiency
            daily_energy = power_output * 6
            monthly_energy = daily_energy * 30
            return {
                "power_output_watts": round(power_output, 2),
                "power_output_kw": round(power_output / 1000, 3),
                "daily_energy_kwh": round(daily_energy, 2),
                "monthly_energy_kwh": round(monthly_energy, 2),
                "efficiency_percentage": round(adjusted_efficiency * 100, 2),
                "temp_correction_factor": round(temp_correction, 3)
            }
        except Exception as e:
            logger.error(f"Solar calculation error: {e}")
            return {"error": str(e)}

    @staticmethod
    def calculate_wind_power(wind_speed, rotor_diameter, air_density=1.225, efficiency=0.35):
        try:
            rotor_area = math.pi * (rotor_diameter / 2) ** 2
            wind_power = 0.5 * air_density * rotor_area * (wind_speed ** 3)
            power_output = wind_power * efficiency
            daily_energy = power_output * 24 / 1000
            monthly_energy = daily_energy * 30
            return {
                "wind_power_watts": round(wind_power, 2),
                "power_output_watts": round(power_output, 2),
                "power_output_kw": round(power_output / 1000, 3),
                "daily_energy_kwh": round(daily_energy, 2),
                "monthly_energy_kwh": round(monthly_energy, 2),
                "rotor_area_m2": round(rotor_area, 2),
                "efficiency_percentage": round(efficiency * 100, 2)
            }
        except Exception as e:
            logger.error(f"Wind calculation error: {e}")
            return {"error": str(e)}

    @staticmethod
    def calculate_hybrid_system(solar_irradiance, wind_speed, panel_area, rotor_diameter):
        try:
            solar_results = SolarWindCalculator.calculate_solar_power(solar_irradiance, panel_area)
            wind_results = SolarWindCalculator.calculate_wind_power(wind_speed, rotor_diameter)
            total_daily_energy = solar_results["daily_energy_kwh"] + wind_results["daily_energy_kwh"]
            total_monthly_energy = solar_results["monthly_energy_kwh"] + wind_results["monthly_energy_kwh"]
            total_power = solar_results["power_output_watts"] + wind_results["power_output_watts"]
            return {
                "solar": solar_results,
                "wind": wind_results,
                "total": {
                    "total_power_watts": round(total_power, 2),
                    "total_power_kw": round(total_power / 1000, 3),
                    "total_daily_energy_kwh": round(total_daily_energy, 2),
                    "total_monthly_energy_kwh": round(total_monthly_energy, 2),
                    "solar_percentage": round((solar_results["daily_energy_kwh"] / total_daily_energy) * 100, 1),
                    "wind_percentage": round((wind_results["daily_energy_kwh"] / total_daily_energy) * 100, 1)
                }
            }
        except Exception as e:
            logger.error(f"Hybrid system calculation error: {e}")
            return {"error": str(e)}

calculator = SolarWindCalculator()

@app.route('/api/hybrid/calculate', methods=['POST'])
def calculate_hybrid():
    try:
        data = request.get_json()
        required_fields = ['solar_irradiance', 'wind_speed', 'panel_area', 'rotor_diameter']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        solar_irradiance = float(data['solar_irradiance'])
        wind_speed = float(data['wind_speed'])
        panel_area = float(data['panel_area'])
        rotor_diameter = float(data['rotor_diameter'])
        results = calculator.calculate_hybrid_system(
            solar_irradiance, wind_speed, panel_area, rotor_diameter
        )
        logger.info(f"Hybrid system calculated: {results}")
        return jsonify({
            "success": True,
            "data": results,
            "timestamp": datetime.now().isoformat()
        })
    except ValueError as e:
        return jsonify({"error": f"Data format error: {str(e)}"}), 400
    except Exception as e:
        logger.error(f"Hybrid system calculation error: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
