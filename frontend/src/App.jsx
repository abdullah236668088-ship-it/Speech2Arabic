import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/processing" element={<ProcessingPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
