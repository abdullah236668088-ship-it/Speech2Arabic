@echo off
echo Starting build process...

REM Create necessary directories
if not exist "models" mkdir models
if not exist "logs" mkdir logs

REM Download VOSK Arabic model if not exists
if not exist "models\vosk-model-ar-0.22" (
    echo Downloading VOSK Arabic model...
    cd models
    powershell -Command "Invoke-WebRequest -Uri 'https://alphacephei.com/vosk/models/vosk-model-ar-0.22.zip' -OutFile 'vosk-model-ar-0.22.zip'"
    powershell -Command "Expand-Archive -Path 'vosk-model-ar-0.22.zip' -DestinationPath '.'"
    del vosk-model-ar-0.22.zip
    cd ..
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Build frontend
echo Building frontend...
cd frontend
npm run build
cd ..

echo Build process completed!
pause
