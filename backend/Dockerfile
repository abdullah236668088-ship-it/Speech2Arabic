FROM python:3.9-slim

# تعيين متغيرات البيئة
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# تعيين دليل العمل
WORKDIR /app

# تثبيت FFmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# نسخ ملفات المتطلبات
COPY backend/requirements.txt .

# تثبيت المكتبات
RUN pip install --no-cache-dir -r requirements.txt

# نسخ باقي الملفات
COPY backend/ .

# إنشاء المجلدات المطلوبة
RUN mkdir -p uploads outputs models

# فتح المنفذ
EXPOSE 5000

# تشغيل التطبيق
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
