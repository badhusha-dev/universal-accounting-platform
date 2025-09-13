#!/bin/bash

# Universal Accounting Platform Setup Script
# This script sets up the entire platform for local development

set -e

echo "🚀 Setting up Universal Accounting Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java 17+ is required but not installed."
        exit 1
    fi
    
    java_version=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$java_version" -lt 17 ]; then
        print_error "Java 17+ is required. Current version: $java_version"
        exit 1
    fi
    
    # Check Maven
    if ! command -v mvn &> /dev/null; then
        print_error "Maven 3.8+ is required but not installed."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 18+ is required but not installed."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is required but not installed."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is required but not installed."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
}

# Build shared modules
build_shared_modules() {
    print_status "Building shared modules..."
    
    cd shared/common-models
    mvn clean install -DskipTests
    cd ../event-contracts
    mvn clean install -DskipTests
    cd ../..
    
    print_success "Shared modules built successfully!"
}

# Build microservices
build_microservices() {
    print_status "Building microservices..."
    
    services=("auth-service" "tenant-service" "ledger-service" "transaction-service" "invoice-service" "reports-service" "api-gateway")
    
    for service in "${services[@]}"; do
        print_status "Building $service..."
        cd "services/$service"
        mvn clean package -DskipTests
        cd ../..
    done
    
    print_success "All microservices built successfully!"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    npm install
    cd ..
    
    print_success "Frontend dependencies installed!"
}

# Start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services..."
    
    # Start PostgreSQL, Redis, Kafka, etc.
    docker-compose up -d postgres redis kafka zookeeper kafka-ui eureka
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    print_success "Infrastructure services started!"
}

# Start microservices
start_microservices() {
    print_status "Starting microservices..."
    
    # Start all microservices
    docker-compose up -d auth-service tenant-service ledger-service transaction-service invoice-service reports-service api-gateway
    
    print_status "Waiting for microservices to be ready..."
    sleep 60
    
    print_success "Microservices started!"
}

# Start frontend
start_frontend() {
    print_status "Starting frontend..."
    
    cd frontend
    npm start &
    cd ..
    
    print_success "Frontend started!"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # This would typically run Flyway migrations
    # For now, we'll just print a message
    print_warning "Database migrations should be run manually for now"
    print_status "You can run migrations using: mvn flyway:migrate"
}

# Display access information
show_access_info() {
    print_success "🎉 Universal Accounting Platform is now running!"
    echo ""
    echo "📱 Access Points:"
    echo "  Frontend:           http://localhost:3000"
    echo "  API Gateway:        http://localhost:8080"
    echo "  Kafka UI:           http://localhost:8081"
    echo "  Eureka Dashboard:   http://localhost:8761"
    echo ""
    echo "🔧 Services:"
    echo "  Auth Service:       http://localhost:8082"
    echo "  Tenant Service:     http://localhost:8083"
    echo "  Ledger Service:     http://localhost:8084"
    echo "  Transaction Service: http://localhost:8085"
    echo "  Invoice Service:    http://localhost:8086"
    echo "  Reports Service:    http://localhost:8087"
    echo ""
    echo "📊 Database:"
    echo "  PostgreSQL:         localhost:5432"
    echo "  Redis:              localhost:6379"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Open http://localhost:3000 in your browser"
    echo "  2. Register a new account"
    echo "  3. Complete the onboarding process"
    echo "  4. Start using the accounting platform!"
    echo ""
    echo "📚 Documentation:"
    echo "  README.md - Complete setup and usage guide"
    echo "  docs/ - Detailed documentation"
    echo ""
    echo "🛠️ Development:"
    echo "  To stop all services: docker-compose down"
    echo "  To view logs: docker-compose logs -f [service-name]"
    echo "  To restart a service: docker-compose restart [service-name]"
}

# Main execution
main() {
    echo "🏗️ Universal Accounting Platform Setup"
    echo "======================================"
    echo ""
    
    check_prerequisites
    build_shared_modules
    build_microservices
    setup_frontend
    start_infrastructure
    run_migrations
    start_microservices
    start_frontend
    show_access_info
}

# Run main function
main "$@"
