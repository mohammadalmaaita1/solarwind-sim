@echo off
REM سكريبت تشغيل SolarWindSim في وضع التطوير للـ Windows

echo 🚀 بدء تشغيل SolarWindSim في وضع التطوير
echo ==========================================

REM التحقق من وجود Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python غير مثبت
    pause
    exit /b 1
)

REM التحقق من وجود Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js غير مثبت
    pause
    exit /b 1
)

REM التحقق من وجود npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm غير مثبت
    pause
    exit /b 1
)

echo ✅ تم التحقق من المتطلبات الأساسية

REM تثبيت متطلبات Python
echo 📦 تثبيت متطلبات Python...
cd api
if not exist "venv" (
    echo إنشاء بيئة افتراضية...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

REM تثبيت متطلبات Node.js
echo 📦 تثبيت متطلبات Node.js...
npm install

REM تشغيل API في نافذة منفصلة
echo 🔧 تشغيل Flask API...
start "Flask API" cmd /k "cd api && call venv\Scripts\activate.bat && python app.py"

REM انتظار قليل لبدء API
timeout /t 3 /nobreak >nul

REM تشغيل Next.js
echo 🌐 تشغيل Next.js Frontend...
npm run dev

echo ⏹️ تم إيقاف جميع الخدمات
pause
