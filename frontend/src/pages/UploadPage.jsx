import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const UploadPage = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const navigate = useNavigate();

    const handleFileUpload = (fileData) => {
        setUploadedFile(fileData);
        toast.success('تم رفع الملف بنجاح، يمكنك الآن المتابعة للمعالجة.');
        // Navigate to processing page with filename as state or param
        navigate('/processing', { state: { filename: fileData.filename } });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">رفع ملف صوتي أو فيديو</h1>
                <FileUpload onFileUpload={handleFileUpload} />
            </div>
        </div>
    );
};

export default UploadPage;
