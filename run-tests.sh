#!/bin/bash

# Universal Accounting Platform - Test Runner Script

echo "🧪 Starting Universal Accounting Platform Test Suite"
echo "=================================================="

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if services are running
print_status "Checking if services are running..."
if ! docker-compose ps | grep -q "Up"; then
    print_warning "Services are not running. Starting services..."
    docker-compose up -d postgres redis
    sleep 10
fi

# Function to run tests for a service
run_service_tests() {
    local service_name=$1
    local service_dir=$2
    
    print_status "Running tests for $service_name..."
    
    if [ -d "$service_dir" ]; then
        cd "$service_dir" || exit 1
        
        # Run unit tests
        if mvn test -q; then
            print_success "$service_name unit tests passed"
        else
            print_error "$service_name unit tests failed"
            return 1
        fi
        
        cd - > /dev/null || exit 1
    else
        print_warning "$service_name directory not found, skipping tests"
    fi
}

# Function to run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    # Start test containers
    docker-compose -f docker-compose.test.yml up -d --build
    
    # Wait for services to be ready
    sleep 30
    
    # Run integration tests
    if mvn test -Dtest=**/*IntegrationTest -q; then
        print_success "Integration tests passed"
    else
        print_error "Integration tests failed"
        return 1
    fi
    
    # Cleanup
    docker-compose -f docker-compose.test.yml down
}

# Function to run performance tests
run_performance_tests() {
    print_status "Running performance tests..."
    
    # Check if JMeter is available
    if command -v jmeter > /dev/null 2>&1; then
        print_status "Running JMeter performance tests..."
        jmeter -n -t performance-tests/accounting-platform.jmx -l performance-results.jtl
        print_success "Performance tests completed. Results saved to performance-results.jtl"
    else
        print_warning "JMeter not found, skipping performance tests"
    fi
}

# Function to generate test report
generate_test_report() {
    print_status "Generating test report..."
    
    # Create reports directory
    mkdir -p reports
    
    # Generate Maven test report
    mvn surefire-report:report -q
    
    # Copy reports to reports directory
    cp -r target/site/surefire-report reports/ 2>/dev/null || true
    
    print_success "Test report generated in reports/ directory"
}

# Main execution
main() {
    local total_services=0
    local passed_services=0
    
    print_status "Starting comprehensive test suite..."
    echo
    
    # Run unit tests for each service
    services=(
        "auth-service:auth-service"
        "tenant-service:tenant-service"
        "ledger-service:ledger-service"
        "reports-service:reports-service"
        "gateway:gateway"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r name dir <<< "$service"
        total_services=$((total_services + 1))
        
        if run_service_tests "$name" "$dir"; then
            passed_services=$((passed_services + 1))
        fi
        echo
    done
    
    # Run integration tests
    if run_integration_tests; then
        print_success "Integration tests completed successfully"
    else
        print_error "Integration tests failed"
    fi
    echo
    
    # Run performance tests
    run_performance_tests
    echo
    
    # Generate test report
    generate_test_report
    echo
    
    # Summary
    echo "=================================================="
    print_status "Test Suite Summary:"
    echo "  Services tested: $total_services"
    echo "  Services passed: $passed_services"
    echo "  Services failed: $((total_services - passed_services))"
    
    if [ $passed_services -eq $total_services ]; then
        print_success "All tests passed! 🎉"
        exit 0
    else
        print_error "Some tests failed. Please check the logs above."
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "unit")
        print_status "Running unit tests only..."
        run_service_tests "auth-service" "auth-service"
        ;;
    "integration")
        print_status "Running integration tests only..."
        run_integration_tests
        ;;
    "performance")
        print_status "Running performance tests only..."
        run_performance_tests
        ;;
    "report")
        print_status "Generating test report only..."
        generate_test_report
        ;;
    *)
        main
        ;;
esac
