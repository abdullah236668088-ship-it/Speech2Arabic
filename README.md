# Speech2Arabic - نظام معالجة الصوت والفيديو للعربية

نظام متكامل لرفع الملفات الصوتية والفيديو، تنقيتها، تحويل الكلام إلى نص عربي، وإنتاج فيديو نهائي مع ترجمة متزامنة.

## المميزات
- رفع ملفات صوتية وفيديو (MP4, AVI, MP3, WAV)
- تنقية الصوت من الضوضاء
- تحويل الكلام إلى نص عربي بدقة عالية
- تحرير النص يدويًا عبر واجهة سهلة
- إنتاج فيديو نهائي مع ترجمة متزامنة
- حذف تلقائي للملفات بعد انتهاء الجلسة

## التقنيات المستخدمة
- **Frontend**: React + Tailwind CSS
- **Backend**: Python Flask
- **معالجة الصوت**: VOSK + noisereduce
- **إنتاج الفيديو**: FFmpeg
- **استضافة**: Firebase Hosting + Google Cloud Run

## البدء
### المتطلبات
- Python 3.8+
- Node.js 16+
- FFmpeg
- Docker (اختياري)

### التثبيت
```bash
# تثبيت Backend
cd backend
pip install -r requirements.txt

# تثبيت Frontend
cd frontend
npm install
```

### التشغيل المحلي
```bash
# تشغيل Backend
cd backend
python app.py

# تشغيل Frontend
cd frontend
npm start
```

## الترخيص
MIT License
