#!/bin/bash

# Universal Accounting Platform - Docker Build Script
# This script provides optimized Docker build commands for different environments

set -e

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

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build [service]     Build Docker images for all services or specific service"
    echo "  up [env]           Start the application (dev/prod)"
    echo "  down               Stop the application"
    echo "  logs [service]     Show logs for all services or specific service"
    echo "  clean              Clean up Docker resources"
    echo "  rebuild [service]  Rebuild Docker images from scratch"
    echo ""
    echo "Options:"
    echo "  --no-cache         Build without using cache"
    echo "  --parallel         Build services in parallel"
    echo ""
    echo "Examples:"
    echo "  $0 build                    # Build all services"
    echo "  $0 build auth-service       # Build only auth-service"
    echo "  $0 up dev                   # Start in development mode"
    echo "  $0 up prod                  # Start in production mode"
    echo "  $0 rebuild --no-cache       # Rebuild all services without cache"
}

# Function to build services
build_services() {
    local service=$1
    local no_cache=$2
    local parallel=$3
    
    local build_args=""
    if [ "$no_cache" = "true" ]; then
        build_args="--no-cache"
    fi
    
    if [ -n "$service" ]; then
        print_status "Building $service..."
        if [ "$parallel" = "true" ]; then
            docker-compose build $build_args $service &
            wait
        else
            docker-compose build $build_args $service
        fi
        print_success "$service built successfully!"
    else
        print_status "Building all services..."
        
        # Build shared modules first
        print_status "Building shared modules..."
        docker-compose build $build_args eureka-server
        
        # Build microservices
        services=("gateway" "auth-service" "tenant-service" "ledger-service" "transaction-service" "reports-service")
        
        if [ "$parallel" = "true" ]; then
            for service in "${services[@]}"; do
                print_status "Building $service..."
                docker-compose build $build_args $service &
            done
            wait
        else
            for service in "${services[@]}"; do
                print_status "Building $service..."
                docker-compose build $build_args $service
            done
        fi
        
        # Build frontend
        print_status "Building frontend..."
        docker-compose build $build_args frontend
        
        print_success "All services built successfully!"
    fi
}

# Function to start application
start_application() {
    local env=$1
    
    case $env in
        "dev")
            print_status "Starting application in development mode..."
            docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
            ;;
        "prod")
            print_status "Starting application in production mode..."
            docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
            ;;
        *)
            print_status "Starting application in default mode..."
            docker-compose up -d
            ;;
    esac
    
    print_success "Application started successfully!"
    print_status "Access the application at: http://localhost:3000"
    print_status "API Gateway at: http://localhost:8080"
    print_status "Eureka Dashboard at: http://localhost:8761"
}

# Function to stop application
stop_application() {
    print_status "Stopping application..."
    docker-compose down
    print_success "Application stopped successfully!"
}

# Function to show logs
show_logs() {
    local service=$1
    
    if [ -n "$service" ]; then
        print_status "Showing logs for $service..."
        docker-compose logs -f $service
    else
        print_status "Showing logs for all services..."
        docker-compose logs -f
    fi
}

# Function to clean up Docker resources
clean_docker() {
    print_warning "This will remove all unused Docker resources. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_status "Cleaning up Docker resources..."
        docker system prune -af
        docker volume prune -f
        print_success "Docker cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to rebuild services
rebuild_services() {
    local service=$1
    local no_cache=$2
    
    print_status "Rebuilding services..."
    
    if [ -n "$service" ]; then
        print_status "Stopping $service..."
        docker-compose stop $service
        print_status "Removing $service image..."
        docker-compose rm -f $service
        build_services $service $no_cache false
    else
        print_status "Stopping all services..."
        docker-compose down
        print_status "Removing all images..."
        docker-compose rm -f
        build_services "" $no_cache false
    fi
    
    print_success "Rebuild completed!"
}

# Parse command line arguments
command=$1
shift

# Parse options
no_cache=false
parallel=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --no-cache)
            no_cache=true
            shift
            ;;
        --parallel)
            parallel=true
            shift
            ;;
        *)
            service_or_env=$1
            shift
            ;;
    esac
done

# Execute commands
case $command in
    "build")
        build_services "$service_or_env" $no_cache $parallel
        ;;
    "up")
        start_application "$service_or_env"
        ;;
    "down")
        stop_application
        ;;
    "logs")
        show_logs "$service_or_env"
        ;;
    "clean")
        clean_docker
        ;;
    "rebuild")
        rebuild_services "$service_or_env" $no_cache
        ;;
    *)
        print_error "Unknown command: $command"
        show_usage
        exit 1
        ;;
esac
