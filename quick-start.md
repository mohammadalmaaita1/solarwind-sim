# 🚀 دليل التشغيل السريع - SolarWindSim

## ⚡ التشغيل السريع (5 دقائق)

### 1. تشغيل Flask API
```bash
cd api
python -m venv venv

# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

pip install -r requirements.txt
python app.py
```

### 2. تشغيل Next.js Frontend
```bash
# في terminal جديد
npm install
npm run dev
```

### 3. فتح التطبيق
- Frontend: http://localhost:9002
- API: http://localhost:5000
- الحاسبة: http://localhost:9002/calculator

## 🧪 اختبار API

```bash
cd api
python test_api.py
```

## 📱 استخدام التطبيق

1. **الطاقة الشمسية**: أدخل الإشعاع الشمسي ومساحة الألواح
2. **الطاقة الريحية**: أدخل سرعة الرياح وقطر الدوار
3. **النظام الهجين**: احسب الطاقة الإجمالية من المصدرين

## 🔧 استكشاف الأخطاء

### مشاكل شائعة:

**API لا يعمل:**
- تأكد من تشغيل Python في مجلد `api`
- تحقق من تثبيت المتطلبات: `pip install -r requirements.txt`

**Frontend لا يتصل بالـ API:**
- تأكد من تشغيل API على المنفذ 5000
- تحقق من إعدادات CORS

**أخطاء في الحسابات:**
- تأكد من صحة البيانات المدخلة
- راجع سجلات API للحصول على تفاصيل الخطأ

## 📞 الدعم السريع

- **API Health Check**: http://localhost:5000/api/health
- **Frontend Status**: http://localhost:9002
- **API Documentation**: راجع `api/README.md`

---

**استمتع باستخدام SolarWindSim! 🌱**
