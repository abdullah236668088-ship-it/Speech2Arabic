import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Upload, Play, Home } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        مرحباً بك في Speech2Arabic
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        نظام معالجة الصوت والفيديو للعربية
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">رفع الملفات</h3>
                        <p className="text-gray-600 mb-4">
                            ارفع ملفاتك الصوتية والفيديوية بسهولة
                        </p>
                        <Link
                            to="/upload"
                            className="btn-primary"
                        >
                            ابدأ الآن
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <Play className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">معالجة الصوت</h3>
                        <p className="text-gray-600 mb-4">
                            تنقية الصوت وتحويل الكلام إلى نص
                        </p>
                        <Link
                            to="/processing"
                            className="btn-primary"
                        >
                            ابدأ الآن
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <Home className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">النتائج</h3>
                        <p className="text-gray-600 mb-4">
                            عرض النتائج وتحميل الفيديو النهائي
                        </p>
                        <Link
                            to="/results"
                            className="btn-primary"
                        >
                            عرض النتائج
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link
                        to="/upload"
                        className="btn-primary text-lg"
                    >
                        ابدأ الآن
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
