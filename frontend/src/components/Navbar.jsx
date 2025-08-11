import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Home, Upload, Settings } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Mic className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold text-gray-900">Speech2Arabic</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
                            <Home className="h-5 w-5" />
                            <span>الرئيسية</span>
                        </Link>
                        <Link to="/upload" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
                            <Upload className="h-5 w-5" />
                            <span>رفع ملف</span>
                        </Link>
                        <Link to="/results" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition">
                            <Settings className="h-5 w-5" />
                            <span>النتائج</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
