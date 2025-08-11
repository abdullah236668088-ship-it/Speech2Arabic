# دليل نشر Speech2Arabic على Render.com

## نظرة عامة
هذا الدليل يشرح كيفية نشر نظام Speech2Arabic بالكامل على Render.com، ويشمل:
- خادم Backend (Python Flask)
- تطبيق Frontend (React)
- إعدادات البيئة والمتغيرات

## المتطلبات
- حساب على Render.com
- مستودع GitHub متصل بـ Render
- FFmpeg مثبت على الخادم (سيتم التعامل معه عبر الإعدادات)

## خطوات النشر

### 1. إعداد المستودع
تأكد من أن جميع الملفات محفوظة في Git:
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin master
```

### 2. نشر Backend على Render

#### الخطوة 1: إنشاء خدمة جديدة
1. توجه إلى [Render Dashboard](https://dashboard.render.com)
2. انقر على "New" → "Web Service"
3. اختر مستودع GitHub الخاص بـ Speech2Arabic

#### الخطوة 2: إعداد الخدمة
- **Name**: `speech2arabic-backend`
- **Environment**: Python
- **Build Command**:
  ```bash
  cd backend && pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  cd backend && gunicorn app:app --bind 0.0.0.0:$PORT
  ```
- **Instance Type**: Free (للبدء)

#### الخطوة 3: متغيرات البيئة
أضف المتغيرات التالية:
- `PYTHON_VERSION=3.9.0`
- `FLASK_ENV=production`
- `FLASK_DEBUG=0`

### 3. نشر Frontend على Render

#### الخطوة 1: إنشاء خدمة جديدة
1. في Render Dashboard، انقر على "New" → "Static Site"
2. اختر نفس المستودع GitHub

#### الخطوة 2: إعداد الخدمة
- **Name**: `speech2arabic-frontend`
- **Build Command**:
  ```bash
  cd frontend && npm install && npm run build
  ```
- **Publish Directory**: `frontend/build`
- **Instance Type**: Free

#### الخطوة 3: متغيرات البيئة
أضف المتغيرات التالية:
- `REACT_APP_API_URL=https://speech2arabic-backend.onrender.com`

### 4. إعدادات إضافية

#### FFmpeg على Render
لتثبيت FFmpeg على خادم Render، أضف إلى ملف `backend/render.yaml`:
```yaml
buildCommand: |
  cd backend
  apt-get update && apt-get install -y ffmpeg
  pip install -r requirements.txt
```

#### CORS Configuration
تم تعديل ملف `app.py` ليقبل الطلبات من النطاق الجديد.

### 5. التحقق من النشر

#### اختبار Backend
```bash
curl https://speech2arabic-backend.onrender.com/health
```

#### اختبار Frontend
افتح المتصفح وانتقل إلى:
```
https://speech2arabic-frontend.onrender.com
```

## استكشاف الأخطاء وحلها

### مشكلة: FFmpeg غير موجود
الحل: أضف FFmpeg إلى متطلبات النظام في build command

### مشكلة: CORS Error
الحل: تأكد من أن `REACT_APP_API_URL` في Frontend يشير إلى URL Backend الصحيح

### مشكلة: Memory Issues
الحل: قد تحتاج إلى ترقية الخطة من Free إلى Starter ($7/شهر)

## مراقبة الأداء
- استخدم Render Dashboard لمراقبة استخدام الموارد
- تحقق من Logs لأي أخطاء
- راقب زمن الاستجابة للطلبات

## التكلفة
- **Free Tier**: 500 ساعة شهرياً لكل خدمة
- **Starter Plan**: $7/شهر لكل خدمة (يوصى به للإنتاج)

## التحديثات المستقبلية
لتحديث التطبيق بعد النشر:
1. ارفع التغييرات إلى GitHub
2. سيتم التحديث تلقائياً عبر Render
