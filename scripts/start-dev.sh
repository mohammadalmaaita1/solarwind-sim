#!/bin/bash

# سكريبت تشغيل SolarWindSim في وضع التطوير

echo "🚀 بدء تشغيل SolarWindSim في وضع التطوير"
echo "=========================================="

# التحقق من وجود Python
if ! command -v python &> /dev/null; then
    echo "❌ Python غير مثبت"
    exit 1
fi

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت"
    exit 1
fi

# التحقق من وجود npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت"
    exit 1
fi

echo "✅ تم التحقق من المتطلبات الأساسية"

# تثبيت متطلبات Python
echo "📦 تثبيت متطلبات Python..."
cd api
if [ ! -d "venv" ]; then
    echo "إنشاء بيئة افتراضية..."
    python -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt
cd ..

# تثبيت متطلبات Node.js
echo "📦 تثبيت متطلبات Node.js..."
npm install

# تشغيل API في الخلفية
echo "🔧 تشغيل Flask API..."
cd api
source venv/bin/activate
python app.py &
API_PID=$!
cd ..

# انتظار قليل لبدء API
sleep 3

# تشغيل Next.js
echo "🌐 تشغيل Next.js Frontend..."
npm run dev

# تنظيف عند الإغلاق
echo "⏹️ إيقاف الخدمات..."
kill $API_PID
echo "✅ تم إيقاف جميع الخدمات"
