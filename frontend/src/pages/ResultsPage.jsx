import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const ResultsPage = () => {
    const location = useLocation();
    const { originalFile, text } = location.state || {};
    const [isGenerating, setIsGenerating] = useState(false);
    const [outputFile, setOutputFile] = useState(null);

    const handleGenerateVideo = async () => {
        if (!originalFile || !text) {
            toast.error('البيانات غير مكتملة لإنتاج الفيديو');
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch('http://localhost:5000/generate-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    original_file: originalFile,
                    text_segments: text,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setOutputFile(data.output_file);
                toast.success('تم إنتاج الفيديو بنجاح');
            } else {
                toast.error(data.error || 'حدث خطأ في إنتاج الفيديو');
            }
        } catch (error) {
            toast.error('فشل الاتصال بالخادم');
            console.error('Video generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">النتائج</h1>

                {outputFile ? (
                    <div className="text-center">
                        <video controls className="mx-auto max-w-full rounded-lg shadow-md">
                            <source src={`http://localhost:5000/${outputFile}`} type="video/mp4" />
                            متصفحك لا يدعم عرض الفيديو.
                        </video>
                        <a
                            href={`http://localhost:5000/${outputFile}`}
                            download
                            className="btn-primary mt-4 inline-block"
                        >
                            تحميل الفيديو النهائي
                        </a>
                    </div>
                ) : (
                    <div className="text-center">
                        <button
                            onClick={handleGenerateVideo}
                            disabled={isGenerating}
                            className="btn-primary"
                        >
                            {isGenerating ? 'جاري إنتاج الفيديو...' : 'إنتاج الفيديو النهائي'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
