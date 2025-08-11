from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid
from werkzeug.utils import secure_filename
import logging
from utils import process_audio_file, extract_text_from_audio, generate_final_video

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# إعداد التطبيق
app = Flask(__name__)
CORS(app)

# إعدادات المجلدات
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mp3', 'wav', 'mov', 'mkv'}

# إنشاء المجلدات إذا لم تكن موجودة
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    """نقطة نهاية للتحقق من صحة النظام"""
    return jsonify({'status': 'healthy', 'message': 'Speech2Arabic API is running'})

@app.route('/upload', methods=['POST'])
def upload_file():
    """رفع ملف صوتي أو فيديو"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'لا يوجد ملف مرفق'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'لم يتم اختيار ملف'}), 400
        
        if file and allowed_file(file.filename):
            # إنشاء اسم فريد للملف
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4().hex}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # حفظ الملف
            file.save(filepath)
            logger.info(f"تم رفع الملف: {filepath}")
            
            # حفظ بيانات الرفع محلياً
            data = {
                'filename': unique_filename,
                'filepath': filepath,
                'upload_time': str(uuid.uuid4())
            }
            # حفظ في ملف JSON محلي
            with open('uploads_metadata.json', 'a') as f:
                json.dump(data, f)
                f.write('\n')
            
            return jsonify({
                'message': 'تم رفع الملف بنجاح',
                'filename': unique_filename,
                'filepath': filepath
            }), 200
        
        return jsonify({'error': 'نوع الملف غير مدعوم'}), 400
    
    except Exception as e:
        logger.error(f"خطأ في رفع الملف: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/process/<filename>', methods=['POST'])
def process_file(filename):
    """معالجة الملف واستخراج النص"""
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'الملف غير موجود'}), 404
        
        # معالجة الصوت
        processed_audio_path = process_audio_file(filepath)
        
        # استخراج النص
        extracted_text = extract_text_from_audio(processed_audio_path)
        
        return jsonify({
            'message': 'تمت المعالجة بنجاح',
            'text': extracted_text,
            'processed_audio': processed_audio_path
        }), 200
    
    except Exception as e:
        logger.error(f"خطأ في المعالجة: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/generate-video', methods=['POST'])
def generate_video():
    """إنتاج الفيديو النهائي مع الترجمة"""
    try:
        data = request.json
        original_file = data.get('original_file')
        text_segments = data.get('text_segments')
        
        if not original_file or not text_segments:
            return jsonify({'error': 'البيانات غير مكتملة'}), 400
        
        # إنتاج الفيديو النهائي
        output_path = generate_final_video(original_file, text_segments)
        
        return jsonify({
            'message': 'تم إنتاج الفيديو بنجاح',
            'output_file': output_path
        }), 200
    
    except Exception as e:
        logger.error(f"خطأ في إنتاج الفيديو: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/cleanup', methods=['POST'])
def cleanup():
    """حذف جميع الملفات المؤقتة"""
    try:
        import shutil
        
        # حذف ملفات uploads
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                logger.error(f"خطأ في حذف الملف {file_path}: {e}")
        
        # حذف ملفات outputs
        for filename in os.listdir(app.config['OUTPUT_FOLDER']):
            file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
            except Exception as e:
                logger.error(f"خطأ في حذف الملف {file_path}: {e}")
        
        return jsonify({'message': 'تم حذف جميع الملفات المؤقتة'}), 200
    
    except Exception as e:
        logger.error(f"خطأ في التنظيف: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)




