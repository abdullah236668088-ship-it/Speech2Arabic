import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextEditor from '../components/TextEditor';
import toast, { Toaster } from 'react-hot-toast';

const ProcessingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [filename, setFilename] = useState(location.state?.filename || '');
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [editedText, setEditedText] = useState('');

    useEffect(() => {
        if (!filename) {
            toast.error('لم يتم تحديد ملف للمعالجة');
            navigate('/upload');
            return;
        }
        processFile();
    }, [filename, navigate]);

    const processFile = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch(`http://localhost:5000/process/${filename}`, {
                method: 'POST',
            });
            const data = await response.json();
            if (response.ok) {
                setExtractedText(data.text);
                setEditedText(data.text);
                toast.success('تمت المعالجة بنجاح');
            } else {
                toast.error(data.error || 'حدث خطأ في المعالجة');
            }
        } catch (error) {
            toast.error('فشل الاتصال بالخادم');
            console.error('Processing error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextChange = (newText) => {
        setEditedText(newText);
    };

    const handleGenerateVideo = () => {
        navigate('/results', { state: { originalFile: filename, text: editedText } });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">معالجة الملف</h1>

                {isProcessing && (
                    <div className="text-center">
                        <div className="loading-spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">جاري معالجة الملف...</p>
                    </div>
                )}

                {!isProcessing && extractedText && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">النص المستخرج:</h2>
                        <TextEditor text={extractedText} onChange={handleTextChange} />
                        <div className="mt-6 text-center">
                            <button onClick={handleGenerateVideo} className="btn-primary">
                                إنتاج الفيديو النهائي
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProcessingPage;
