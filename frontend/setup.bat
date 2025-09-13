@echo off
REM Universal Accounting Platform Frontend Setup Script

echo 🚀 Setting up Universal Accounting Platform Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Navigate to frontend directory
cd frontend

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    echo VITE_API_BASE_URL=http://localhost:8080 > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the development server:
echo   cd frontend
echo   npm run dev
echo.
echo The application will be available at http://localhost:3000
echo.
echo Make sure your backend API Gateway is running on http://localhost:8080
pause
