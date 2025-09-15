# SolarWindSim Flask API

## 📋 نظرة عامة

هذا API مبني باستخدام Flask لخدمة مشروع SolarWindSim، ويوفر حسابات علمية دقيقة للطاقة الشمسية والريحية.

## 🚀 التثبيت والتشغيل

### 1. تثبيت المتطلبات

```bash
cd solarwind-sim/api
pip install -r requirements.txt
```

### 2. تشغيل الخادم

```bash
python app.py
```

سيتم تشغيل الخادم على `http://localhost:5000`

### 3. اختبار API

```bash
python test_api.py
```

## 📡 نقاط النهاية (Endpoints)

### 1. فحص صحة API
```
GET /api/health
```

**الاستجابة:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "service": "SolarWindSim API"
}
```

### 2. حساب الطاقة الشمسية
```
POST /api/solar/calculate
```

**البيانات المطلوبة:**
```json
{
  "irradiance": 800,      // الإشعاع الشمسي (W/m²)
  "panel_area": 10,       // مساحة الألواح (m²)
  "efficiency": 0.15,     // كفاءة الألواح (اختياري، افتراضي: 0.15)
  "temperature": 30       // درجة الحرارة (اختياري، افتراضي: 25°C)
}
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "power_output_watts": 1200.0,
    "power_output_kw": 1.2,
    "daily_energy_kwh": 7.2,
    "monthly_energy_kwh": 216.0,
    "efficiency_percentage": 14.4,
    "temp_correction_factor": 0.98
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### 3. حساب الطاقة الريحية
```
POST /api/wind/calculate
```

**البيانات المطلوبة:**
```json
{
  "wind_speed": 8,        // سرعة الرياح (m/s)
  "rotor_diameter": 20,   // قطر الدوار (m)
  "efficiency": 0.35,     // كفاءة التوربين (اختياري، افتراضي: 0.35)
  "air_density": 1.225    // كثافة الهواء (اختياري، افتراضي: 1.225 kg/m³)
}
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "wind_power_watts": 15708.0,
    "power_output_watts": 5497.8,
    "power_output_kw": 5.498,
    "daily_energy_kwh": 131.95,
    "monthly_energy_kwh": 3958.5,
    "rotor_area_m2": 314.16,
    "efficiency_percentage": 35.0
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### 4. حساب النظام الهجين
```
POST /api/hybrid/calculate
```

**البيانات المطلوبة:**
```json
{
  "solar_irradiance": 800,  // الإشعاع الشمسي (W/m²)
  "wind_speed": 8,          // سرعة الرياح (m/s)
  "panel_area": 10,         // مساحة الألواح (m²)
  "rotor_diameter": 20      // قطر الدوار (m)
}
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "solar": { /* نتائج الطاقة الشمسية */ },
    "wind": { /* نتائج الطاقة الريحية */ },
    "total": {
      "total_power_watts": 6697.8,
      "total_power_kw": 6.698,
      "total_daily_energy_kwh": 139.15,
      "total_monthly_energy_kwh": 4174.5,
      "solar_percentage": 5.2,
      "wind_percentage": 94.8
    }
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### 5. محاكاة الطقس
```
POST /api/weather/simulation
```

**البيانات المطلوبة:**
```json
{
  "hours": 24  // عدد الساعات (اختياري، افتراضي: 24)
}
```

**الاستجابة:**
```json
{
  "success": true,
  "data": {
    "time": ["00:00", "01:00", ...],
    "solar_irradiance": [0, 0, ...],
    "wind_speed": [5.2, 4.8, ...]
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

## 🔧 التكامل مع Next.js

### إعداد CORS
تم إعداد CORS للسماح بالطلبات من Next.js frontend:

```javascript
// في Next.js component
const calculateSolarPower = async (data) => {
  try {
    const response = await fetch('http://localhost:5000/api/solar/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('خطأ في الاتصال مع API:', error);
  }
};
```

### مثال على الاستخدام في React Hook

```javascript
import { useState } from 'react';

const useSolarWindAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateHybrid = async (params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/hybrid/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'خطأ في الحساب');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { calculateHybrid, loading, error };
};
```

## 📊 المعادلات العلمية

### الطاقة الشمسية
```
P = G × A × η × f_temp
```
حيث:
- `P`: الطاقة المنتجة (W)
- `G`: الإشعاع الشمسي (W/m²)
- `A`: مساحة الألواح (m²)
- `η`: كفاءة الألواح
- `f_temp`: عامل تصحيح درجة الحرارة

### الطاقة الريحية
```
P = 0.5 × ρ × A × v³ × η
```
حيث:
- `P`: الطاقة المنتجة (W)
- `ρ`: كثافة الهواء (kg/m³)
- `A`: مساحة الدوار (m²)
- `v`: سرعة الرياح (m/s)
- `η`: كفاءة التوربين

## 🛠️ التطوير

### إضافة نقاط نهاية جديدة

```python
@app.route('/api/new-endpoint', methods=['POST'])
def new_endpoint():
    try:
        data = request.get_json()
        # منطق الحساب هنا
        return jsonify({
            "success": True,
            "data": results,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

### إضافة حسابات جديدة

```python
class SolarWindCalculator:
    @staticmethod
    def new_calculation(param1, param2):
        # منطق الحساب الجديد
        return {
            "result": calculated_value,
            "units": "unit"
        }
```

## 📝 السجلات (Logging)

يتم تسجيل جميع العمليات في console:
- طلبات API
- أخطاء الحساب
- معلومات التصحيح

## 🔒 الأمان

- التحقق من صحة البيانات المدخلة
- معالجة الأخطاء بشكل آمن
- عدم كشف معلومات حساسة في الاستجابات

## 📈 الأداء

- حسابات سريعة باستخدام NumPy
- استجابات فورية للطلبات
- إمكانية التوسع لمعالجة طلبات متعددة

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch جديد
3. إضافة الميزات الجديدة
4. اختبار التغييرات
5. إرسال Pull Request 