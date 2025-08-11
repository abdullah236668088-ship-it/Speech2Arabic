#!/bin/bash
# Build script for Speech2Arabic frontend

echo "Building Speech2Arabic frontend..."

# Install dependencies
npm install

# Build the application
npm run build

echo "Frontend build completed successfully!"
echo "Build files are in: frontend/build/"
