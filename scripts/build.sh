#!/bin/bash

# Build script for Speech2Arabic project

echo "Starting build process..."

# Create necessary directories
mkdir -p models
mkdir -p logs

# Download VOSK Arabic model if not exists
if [ ! -d "models/vosk-model-ar-0.22" ]; then
    echo "Downloading VOSK Arabic model..."
    cd models
    wget https://alphacephei.com/vosk/models/vosk-model-ar-0.22.zip
    unzip vosk-model-ar-0.22.zip
    rm vosk-model-ar-0.22.zip
    cd ..
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Build process completed!"
