#!/bin/bash

# Universal Accounting Platform Startup Script
echo "🚀 Starting Universal Accounting Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

echo "📦 Building and starting all services..."

# Build and start all services
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."

# Wait for Eureka Server
echo "Waiting for Eureka Server..."
while ! curl -f http://localhost:8761/actuator/health > /dev/null 2>&1; do
    sleep 5
done
echo "✅ Eureka Server is ready"

# Wait for API Gateway
echo "Waiting for API Gateway..."
while ! curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
    sleep 5
done
echo "✅ API Gateway is ready"

# Wait for Auth Service
echo "Waiting for Auth Service..."
while ! curl -f http://localhost:8082/actuator/health > /dev/null 2>&1; do
    sleep 5
done
echo "✅ Auth Service is ready"

# Wait for Tenant Service
echo "Waiting for Tenant Service..."
while ! curl -f http://localhost:8083/actuator/health > /dev/null 2>&1; do
    sleep 5
done
echo "✅ Tenant Service is ready"

# Wait for Ledger Service
echo "Waiting for Ledger Service..."
while ! curl -f http://localhost:8084/actuator/health > /dev/null 2>&1; do
    sleep 5
done
echo "✅ Ledger Service is ready"

# Wait for Reports Service
echo "Waiting for Reports Service..."
while ! curl -f http://localhost:8087/actuator/health > /dev/null 2>&1; do
    sleep 5
done
echo "✅ Reports Service is ready"

# Wait for Frontend
echo "Waiting for Frontend..."
while ! curl -f http://localhost:3000 > /dev/null 2>&1; do
    sleep 5
done
echo "✅ Frontend is ready"

echo ""
echo "🎉 Universal Accounting Platform is now running!"
echo ""
echo "📋 Service URLs:"
echo "   Frontend:           http://localhost:3000"
echo "   API Gateway:        http://localhost:8080"
echo "   Eureka Server:      http://localhost:8761"
echo "   Kafka UI:           http://localhost:8081"
echo ""
echo "🔐 Default Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📊 Services Status:"
docker-compose ps
echo ""
echo "🛑 To stop all services, run: docker-compose down"
echo "📝 To view logs, run: docker-compose logs -f [service-name]"
echo ""
echo "Happy accounting! 📊✨"