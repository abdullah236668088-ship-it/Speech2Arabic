# Speech2Arabic Setup Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ and npm
- Python 3.9+
- Firebase account with free tier

## Quick Start

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "speech2arabic"
3. Enable Firebase Authentication and Storage
4. Generate a service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file and replace the content in `firebase-service-account.json`
5. Update the `.env` file with your actual Firebase configuration

### 2. VOSK Arabic Model Setup
The Arabic model will be automatically downloaded during the build process. If you need to download it manually:

```bash
# Create models directory
mkdir -p models

# Download Arabic model
cd models
wget https://alphacephei.com/vosk/models/vosk-model-ar-0.22.zip
unzip vosk-model-ar-0.22.zip
rm vosk-model-ar-0.22.zip
cd ..
```

### 3. Environment Setup
```bash
# Copy environment variables (already created as .env)
# Edit .env with your Firebase configuration
```

### 4. Build and Run with Docker
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 5. Manual Setup (Alternative)
```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm start
```

## Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Redis: localhost:6379

## Firebase Configuration
Update the following in your Firebase project:
1. Enable Authentication (Email/Password)
2. Enable Cloud Storage
3. Set up security rules for storage
4. Update CORS settings for your domain

## Troubleshooting
- Ensure all environment variables are set correctly
- Check Docker logs: `docker-compose logs`
- Verify Firebase service account has proper permissions
- Ensure VOSK model is downloaded correctly

## Development Commands
```bash
# Stop all services
docker-compose down

# Rebuild without cache
docker-compose build --no-cache

# View logs
docker-compose logs -f

# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh
