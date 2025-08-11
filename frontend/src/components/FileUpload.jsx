import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUpload = ({ onFileUpload }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'audio/mp3', 'audio/wav'];

        if (!allowedTypes.includes(file.type)) {
            toast.error('نوع الملف غير مدعوم. الرجاء اختيار ملف صوتي أو فيديو.');
            return;
        }

        if (file.size > 100 * 1024 * 1024) {
            toast.error('حجم الملف يجب أن يكون أقل من 100 ميجابايت.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadedFile(data);
                onFileUpload(data);
                toast.success('تم رفع الملف بنجاح!');
            } else {
                toast.error(data.error || 'حدث خطأ في رفع الملف');
            }
        } catch (error) {
            toast.error('فشل الاتصال بالخادم');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.avi', '.mov', '.mkv'],
            'audio/*': ['.mp3', '.wav']
        },
        maxFiles: 1,
        disabled: uploading
    });

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
                    ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <input {...getInputProps()} />

                {uploading ? (
                    <div className="flex flex-col items-center">
                        <div className="loading-spinner mb-4"></div>
                        <p className="text-gray-600">جاري رفع الملف...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                        {isDragActive ? (
                            <p className="text-primary-600 font-medium">أفلت الملف هنا...</p>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-2">
                                    اسحب وأفلت الملف هنا أو انقر للاختيار
                                </p>
                                <p className="text-sm text-gray-500">
                                    الملفات المدعومة: MP4, AVI, MOV, MKV, MP3, WAV (الحد الأقصى: 100 ميجابايت)
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <File className="h-5 w-5 text-green-600 ml-2" />
                        <div>
                            <p className="font-medium text-green-800">{uploadedFile.filename}</p>
                            <p className="text-sm text-green-600">تم رفع الملف بنجاح</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
