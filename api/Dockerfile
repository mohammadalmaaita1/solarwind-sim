# استخدام Python 3.11 كصورة أساسية
FROM python:3.11-slim

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات المتطلبات
COPY requirements.txt .

# تثبيت المتطلبات
RUN pip install --no-cache-dir -r requirements.txt

# نسخ كود التطبيق
COPY . .

# إنشاء مستخدم غير root
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# فتح المنفذ
EXPOSE 5000

# متغيرات البيئة
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# تشغيل التطبيق
CMD ["python", "run.py"] 