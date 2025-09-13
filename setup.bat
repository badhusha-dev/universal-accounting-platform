@echo off
REM Universal Accounting Platform Setup Script for Windows
REM This script sets up the entire platform for local development

echo 🚀 Setting up Universal Accounting Platform...

REM Check prerequisites
echo [INFO] Checking prerequisites...

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java 17+ is required but not installed.
    exit /b 1
)

REM Check Maven
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven 3.8+ is required but not installed.
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js 18+ is required but not installed.
    exit /b 1
)

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is required but not installed.
    exit /b 1
)

REM Check Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is required but not installed.
    exit /b 1
)

echo [SUCCESS] All prerequisites are met!

REM Build shared modules
echo [INFO] Building shared modules...
cd shared\common-models
call mvn clean install -DskipTests
cd ..\event-contracts
call mvn clean install -DskipTests
cd ..\..

echo [SUCCESS] Shared modules built successfully!

REM Build microservices
echo [INFO] Building microservices...
cd services\auth-service
call mvn clean package -DskipTests
cd ..\tenant-service
call mvn clean package -DskipTests
cd ..\ledger-service
call mvn clean package -DskipTests
cd ..\transaction-service
call mvn clean package -DskipTests
cd ..\invoice-service
call mvn clean package -DskipTests
cd ..\reports-service
call mvn clean package -DskipTests
cd ..\api-gateway
call mvn clean package -DskipTests
cd ..\..

echo [SUCCESS] All microservices built successfully!

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend
call npm install
cd ..

echo [SUCCESS] Frontend dependencies installed!

REM Start infrastructure services
echo [INFO] Starting infrastructure services...
docker-compose up -d postgres redis kafka zookeeper kafka-ui eureka

echo [INFO] Waiting for services to be ready...
timeout /t 30 /nobreak >nul

echo [SUCCESS] Infrastructure services started!

REM Start microservices
echo [INFO] Starting microservices...
docker-compose up -d auth-service tenant-service ledger-service transaction-service invoice-service reports-service api-gateway

echo [INFO] Waiting for microservices to be ready...
timeout /t 60 /nobreak >nul

echo [SUCCESS] Microservices started!

REM Start frontend
echo [INFO] Starting frontend...
cd frontend
start "Frontend" npm start
cd ..

echo [SUCCESS] Frontend started!

REM Display access information
echo.
echo [SUCCESS] 🎉 Universal Accounting Platform is now running!
echo.
echo 📱 Access Points:
echo   Frontend:           http://localhost:3000
echo   API Gateway:        http://localhost:8080
echo   Kafka UI:           http://localhost:8081
echo   Eureka Dashboard:   http://localhost:8761
echo.
echo 🔧 Services:
echo   Auth Service:       http://localhost:8082
echo   Tenant Service:     http://localhost:8083
echo   Ledger Service:     http://localhost:8084
echo   Transaction Service: http://localhost:8085
echo   Invoice Service:    http://localhost:8086
echo   Reports Service:    http://localhost:8087
echo.
echo 📊 Database:
echo   PostgreSQL:         localhost:5432
echo   Redis:              localhost:6379
echo.
echo 🚀 Next Steps:
echo   1. Open http://localhost:3000 in your browser
echo   2. Register a new account
echo   3. Complete the onboarding process
echo   4. Start using the accounting platform!
echo.
echo 📚 Documentation:
echo   README.md - Complete setup and usage guide
echo   docs/ - Detailed documentation
echo.
echo 🛠️ Development:
echo   To stop all services: docker-compose down
echo   To view logs: docker-compose logs -f [service-name]
echo   To restart a service: docker-compose restart [service-name]
echo.
pause
