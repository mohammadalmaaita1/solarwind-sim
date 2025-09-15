// أنواع البيانات للـ API
export interface SolarCalculationParams {
  irradiance: number;      // W/m²
  panel_area: number;      // m²
  efficiency?: number;     // 0-1
  temperature?: number;    // °C
}

export interface WindCalculationParams {
  wind_speed: number;      // m/s
  rotor_diameter: number;  // m
  efficiency?: number;     // 0-1
  air_density?: number;    // kg/m³
}

export interface HybridCalculationParams {
  solar_irradiance: number;  // W/m²
  wind_speed: number;        // m/s
  panel_area: number;        // m²
  rotor_diameter: number;    // m
}

export interface WeatherSimulationParams {
  hours?: number;  // عدد الساعات
}

// أنواع النتائج
export interface SolarCalculationResult {
  power_output_watts: number;
  power_output_kw: number;
  daily_energy_kwh: number;
  monthly_energy_kwh: number;
  efficiency_percentage: number;
  temp_correction_factor: number;
}

export interface WindCalculationResult {
  wind_power_watts: number;
  power_output_watts: number;
  power_output_kw: number;
  daily_energy_kwh: number;
  monthly_energy_kwh: number;
  rotor_area_m2: number;
  efficiency_percentage: number;
}

export interface HybridCalculationResult {
  solar: SolarCalculationResult;
  wind: WindCalculationResult;
  total: {
    total_power_watts: number;
    total_power_kw: number;
    total_daily_energy_kwh: number;
    total_monthly_energy_kwh: number;
    solar_percentage: number;
    wind_percentage: number;
  };
}

export interface WeatherSimulationResult {
  time: string[];
  solar_irradiance: number[];
  wind_speed: number[];
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface APIError {
  error: string;
}

// إعدادات API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// فئة للتفاعل مع API
class SolarWindAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // دالة مساعدة لإرسال الطلبات
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    data?: any
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && method === 'POST') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error((result as APIError).error || `HTTP error! status: ${response.status}`);
      }

      return result as APIResponse<T>;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // فحص صحة API
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.makeRequest('/health');
  }

  // حساب الطاقة الشمسية
  async calculateSolar(params: SolarCalculationParams): Promise<SolarCalculationResult> {
    const response = await this.makeRequest<SolarCalculationResult>('/solar/calculate', 'POST', params);
    return response.data;
  }

  // حساب الطاقة الريحية
  async calculateWind(params: WindCalculationParams): Promise<WindCalculationResult> {
    const response = await this.makeRequest<WindCalculationResult>('/wind/calculate', 'POST', params);
    return response.data;
  }

  // حساب النظام الهجين
  async calculateHybrid(params: HybridCalculationParams): Promise<HybridCalculationResult> {
    const response = await this.makeRequest<HybridCalculationResult>('/hybrid/calculate', 'POST', params);
    return response.data;
  }

  // محاكاة الطقس
  async simulateWeather(params: WeatherSimulationParams = {}): Promise<WeatherSimulationResult> {
    const response = await this.makeRequest<WeatherSimulationResult>('/weather/simulation', 'POST', params);
    return response.data;
  }
}

// إنشاء مثيل افتراضي من API
export const solarWindAPI = new SolarWindAPI();

// React Hook للاستخدام في المكونات
import { useState, useCallback } from 'react';

export function useSolarWindAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSolar = useCallback(async (params: SolarCalculationParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await solarWindAPI.calculateSolar(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateWind = useCallback(async (params: WindCalculationParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await solarWindAPI.calculateWind(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateHybrid = useCallback(async (params: HybridCalculationParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await solarWindAPI.calculateHybrid(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const simulateWeather = useCallback(async (params: WeatherSimulationParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await solarWindAPI.simulateWeather(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    calculateSolar,
    calculateWind,
    calculateHybrid,
    simulateWeather,
    clearError,
  };
}

// دالة مساعدة لتحويل الوحدات
export const unitConverters = {
  // تحويل واط إلى كيلوواط
  wattsToKilowatts: (watts: number): number => watts / 1000,
  
  // تحويل كيلوواط إلى واط
  kilowattsToWatts: (kw: number): number => kw * 1000,
  
  // تحويل كيلوواط ساعة إلى ميجاواط ساعة
  kwhToMwh: (kwh: number): number => kwh / 1000,
  
  // تحويل متر في الثانية إلى كيلومتر في الساعة
  msToKmh: (ms: number): number => ms * 3.6,
  
  // تحويل كيلومتر في الساعة إلى متر في الثانية
  kmhToMs: (kmh: number): number => kmh / 3.6,
};

// دالة مساعدة لتنسيق الأرقام
export const formatNumber = {
  // تنسيق الطاقة
  power: (value: number, unit: 'W' | 'kW' | 'MW' = 'W'): string => {
    if (unit === 'W') return `${value.toFixed(1)} W`;
    if (unit === 'kW') return `${value.toFixed(2)} kW`;
    if (unit === 'MW') return `${value.toFixed(3)} MW`;
    return `${value.toFixed(1)}`;
  },
  
  // تنسيق الطاقة اليومية/الشهرية
  energy: (value: number, unit: 'kWh' | 'MWh' = 'kWh'): string => {
    if (unit === 'kWh') return `${value.toFixed(1)} kWh`;
    if (unit === 'MWh') return `${value.toFixed(2)} MWh`;
    return `${value.toFixed(1)}`;
  },
  
  // تنسيق النسبة المئوية
  percentage: (value: number): string => `${value.toFixed(1)}%`,
  
  // تنسيق السرعة
  speed: (value: number, unit: 'm/s' | 'km/h' = 'm/s'): string => {
    if (unit === 'm/s') return `${value.toFixed(1)} m/s`;
    if (unit === 'km/h') return `${value.toFixed(1)} km/h`;
    return `${value.toFixed(1)}`;
  },
};

export default SolarWindAPI; 