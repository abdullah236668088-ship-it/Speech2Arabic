import os
import subprocess
import json
from vosk import Model, KaldiRecognizer
import wave
import numpy as np
import noisereduce as nr
from pydub import AudioSegment
import logging

logger = logging.getLogger(__name__)

# تحميل موديل VOSK للعربية
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'vosk-model-ar-mgb2')
if not os.path.exists(MODEL_PATH):
    logger.warning(f"موديل VOSK غير موجود في {MODEL_PATH}")
    MODEL_PATH = None

def process_audio_file(input_path):
    """تنقية الصوت من الضوضاء"""
    try:
        # تحويل الملف إلى WAV إذا لزم الأمر
        if not input_path.endswith('.wav'):
            audio = AudioSegment.from_file(input_path)
            wav_path = input_path.rsplit('.', 1)[0] + '_temp.wav'
            audio.export(wav_path, format='wav')
            input_path = wav_path
        
        # قراءة الملف الصوتي
        with wave.open(input_path, 'rb') as wav_file:
            params = wav_file.getparams()
            frames = wav_file.readframes(params.nframes)
            audio_data = np.frombuffer(frames, dtype=np.int16)
        
        # تنقية الصوت
        reduced_noise = nr.reduce_noise(y=audio_data, sr=params.framerate)
        
        # حفظ الصوت المنقى
        output_path = input_path.rsplit('.', 1)[0] + '_processed.wav'
        with wave.open(output_path, 'wb') as wav_out:
            wav_out.setparams(params)
            wav_out.writeframes(reduced_noise.astype(np.int16).tobytes())
        
        logger.info(f"تم تنقية الصوت: {output_path}")
        return output_path
    
    except Exception as e:
        logger.error(f"خطأ في تنقية الصوت: {str(e)}")
        return input_path  # إرجاع الملف الأصلي في حالة الخطأ

def extract_text_from_audio(audio_path):
    """استخراج النص من الصوت باستخدام VOSK"""
    try:
        if MODEL_PATH is None or not os.path.exists(MODEL_PATH):
            logger.error("موديل VOSK غير متاح")
            return "خطأ: موديل التعرف على الكلام غير متاح"
        
        # تحميل الموديل
        model = Model(MODEL_PATH)
        
        # قراءة الملف الصوتي
        wf = wave.open(audio_path, "rb")
        if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
            logger.error("تنسيق الصوت غير مدعوم")
            return "خطأ: تنسيق الصوت غير مدعوم"
        
        # إعداد المستمع
        rec = KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True)
        
        # استخراج النص
        results = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                if 'text' in result and result['text']:
                    results.append(result['text'])
        
        # النتيجة النهائية
        final_result = json.loads(rec.FinalResult())
        if 'text' in final_result and final_result['text']:
            results.append(final_result['text'])
        
        text = ' '.join(results)
        logger.info(f"تم استخراج النص: {len(text)} حرف")
        return text
    
    except Exception as e:
        logger.error(f"خطأ في استخراج النص: {str(e)}")
        return f"خطأ في المعالجة: {str(e)}"

def generate_final_video(original_file, text_segments):
    """إنتاج الفيديو النهائي مع الترجمة"""
    try:
        output_filename = f"final_{os.path.basename(original_file)}"
        output_path = os.path.join('outputs', output_filename)
        
        # إعدادات FFmpeg
        ffmpeg_cmd = [
            'ffmpeg',
            '-i', original_file,
            '-vf', f"subtitles={text_segments}:force_style='FontName=Arial,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=3'",
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-strict', 'experimental',
            output_path
        ]
        
        # تشغيل FFmpeg
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"خطأ في FFmpeg: {result.stderr}")
            # إنشاء فيديو بدون ترجمة كنسخة احتياطية
            fallback_cmd = [
                'ffmpeg',
                '-i', original_file,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                output_path
            ]
            subprocess.run(fallback_cmd, check=True)
        
        logger.info(f"تم إنتاج الفيديو: {output_path}")
        return output_path
    
    except Exception as e:
        logger.error(f"خطأ في إنتاج الفيديو: {str(e)}")
        return None

def format_text_segments(text, segment_duration=5):
    """تقسيم النص إلى مقاطع زمنية لإنتاج الترجمة"""
    try:
        words = text.split()
        segments = []
        
        for i in range(0, len(words), segment_duration):
            segment_words = words[i:i+segment_duration]
            segment_text = ' '.join(segment_words)
            start_time = i * segment_duration
            end_time = (i + len(segment_words)) * segment_duration
            
            segments.append({
                'text': segment_text,
                'start': start_time,
                'end': end_time
            })
        
        return segments
    
    except Exception as e:
        logger.error(f"خطأ في تقسيم النص: {str(e)}")
        return [{'text': text, 'start': 0, 'end': 10}]
