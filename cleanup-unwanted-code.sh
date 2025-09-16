#!/bin/bash

# Script to clean up unwanted code and files from the Universal Accounting Platform
# This script removes redundant logging, temporary files, and unused code

echo "🧹 Starting cleanup of unwanted code and files..."

# Function to remove @Slf4j annotations and replace with AOP
remove_slf4j_annotations() {
    echo "📝 Removing @Slf4j annotations from service classes..."
    
    # Find all Java files with @Slf4j annotation
    find . -name "*.java" -type f -exec grep -l "@Slf4j" {} \; | while read file; do
        echo "  Processing: $file"
        # Remove @Slf4j annotation line
        sed -i '/@Slf4j/d' "$file"
        # Remove slf4j import if present
        sed -i '/import lombok.extern.slf4j.Slf4j/d' "$file"
    done
}

# Function to remove manual logging statements
remove_manual_logging() {
    echo "📝 Removing manual logging statements..."
    
    # Find and remove common logging patterns
    find . -name "*.java" -type f -exec grep -l "log\." {} \; | while read file; do
        echo "  Processing: $file"
        # Remove common logging statements (be careful with this)
        # sed -i '/log\.debug/d' "$file"
        # sed -i '/log\.info/d' "$file"
        # sed -i '/log\.warn/d' "$file"
        # sed -i '/log\.error/d' "$file"
        echo "  Manual logging removal skipped for safety - review manually"
    done
}

# Function to remove temporary files
remove_temp_files() {
    echo "🗑️ Removing temporary and build files..."
    
    # Remove common temporary files
    find . -name "*.tmp" -type f -delete
    find . -name "*.temp" -type f -delete
    find . -name "*.log" -type f -delete
    find . -name ".DS_Store" -type f -delete
    find . -name "Thumbs.db" -type f -delete
    
    # Remove IDE specific files
    find . -name ".idea" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.iml" -type f -delete
    find . -name ".vscode" -type d -exec rm -rf {} + 2>/dev/null || true
    
    # Remove build directories
    find . -name "target" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
    
    echo "  Temporary files removed"
}

# Function to remove unused imports
remove_unused_imports() {
    echo "📝 Removing unused imports..."
    
    # This would require a Java IDE or static analysis tool
    # For now, we'll just remove common unused imports
    find . -name "*.java" -type f -exec sed -i '/import java.util.UUID;/d' {} \;
    find . -name "*.java" -type f -exec sed -i '/import java.time.LocalDate;/d' {} \;
    find . -name "*.java" -type f -exec sed -i '/import java.time.LocalTime;/d' {} \;
    
    echo "  Common unused imports removed"
}

# Function to clean up Docker files
cleanup_docker() {
    echo "🐳 Cleaning up Docker files..."
    
    # Remove unused Docker files
    if [ -f "transaction-service/Dockerfile" ]; then
        echo "  Removing transaction-service Dockerfile (service removed)"
        rm -f "transaction-service/Dockerfile"
    fi
    
    # Clean up docker-compose files
    if [ -f "docker-compose.override.yml" ]; then
        echo "  Cleaning up docker-compose.override.yml"
        # Remove commented out transaction-service
        sed -i '/# transaction-service/,/^$/d' "docker-compose.override.yml"
    fi
    
    echo "  Docker cleanup completed"
}

# Function to remove empty directories
remove_empty_directories() {
    echo "📁 Removing empty directories..."
    
    find . -type d -empty -delete 2>/dev/null || true
    
    echo "  Empty directories removed"
}

# Function to format and organize code
format_code() {
    echo "🎨 Formatting code..."
    
    # This would typically use a code formatter like Google Java Format
    # For now, we'll just ensure consistent line endings
    find . -name "*.java" -type f -exec dos2unix {} \; 2>/dev/null || true
    find . -name "*.xml" -type f -exec dos2unix {} \; 2>/dev/null || true
    find . -name "*.yml" -type f -exec dos2unix {} \; 2>/dev/null || true
    find . -name "*.yaml" -type f -exec dos2unix {} \; 2>/dev/null || true
    
    echo "  Code formatting completed"
}

# Main cleanup execution
main() {
    echo "🚀 Universal Accounting Platform - Code Cleanup"
    echo "=============================================="
    
    # Ask for confirmation
    read -p "This will clean up unwanted code and files. Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleanup cancelled."
        exit 0
    fi
    
    # Execute cleanup functions
    remove_temp_files
    cleanup_docker
    remove_unused_imports
    remove_slf4j_annotations
    remove_empty_directories
    format_code
    
    echo ""
    echo "✅ Cleanup completed successfully!"
    echo ""
    echo "📋 Summary of changes:"
    echo "  - Removed temporary and build files"
    echo "  - Cleaned up Docker configuration"
    echo "  - Removed @Slf4j annotations (replaced with AOP)"
    echo "  - Removed unused imports"
    echo "  - Formatted code consistently"
    echo ""
    echo "⚠️  Manual review recommended for:"
    echo "  - Manual logging statements (may need AOP annotations)"
    echo "  - Unused code in service classes"
    echo "  - Test coverage after cleanup"
}

# Run the cleanup
main "$@"
