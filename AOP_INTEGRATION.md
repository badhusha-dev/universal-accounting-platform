# AOP Integration Guide

## Overview

This document describes the Aspect-Oriented Programming (AOP) integration in the Universal Accounting Platform. AOP has been implemented to handle cross-cutting concerns like logging, performance monitoring, security, and exception handling.

## Architecture

### Common Aspects Module

The `shared/common-aspects` module contains all reusable AOP aspects:

```
shared/common-aspects/
├── src/main/java/com/universal/accounting/common/aspects/
│   ├── LoggingAspect.java          # Automatic method logging
│   ├── PerformanceMonitoringAspect.java # Performance metrics
│   ├── SecurityAspect.java         # Security and authorization
│   ├── ExceptionHandlingAspect.java # Centralized exception handling
│   ├── LogExecution.java           # Annotation for logging
│   ├── MonitorPerformance.java     # Annotation for performance monitoring
│   ├── RequireRole.java           # Annotation for role-based access
│   ├── RequireTenant.java         # Annotation for tenant validation
│   └── HandleExceptions.java      # Annotation for exception handling
└── pom.xml
```

## Available Aspects

### 1. Logging Aspect (`LoggingAspect`)

**Purpose**: Automatic method execution logging with structured output

**Features**:
- Automatic method entry/exit logging
- Argument and result sanitization
- Trace ID generation for request correlation
- Configurable log levels
- Sensitive data redaction

**Usage**:
```java
@LogExecution
@MonitorPerformance
public AuthResponse login(LoginRequest request) {
    // Method implementation
}
```

**Configuration**:
```java
@LogExecution(
    level = LogExecution.LogLevel.DEBUG,
    includeArgs = true,
    includeResult = false,
    message = "User authentication"
)
```

### 2. Performance Monitoring Aspect (`PerformanceMonitoringAspect`)

**Purpose**: Automatic performance metrics collection

**Features**:
- Method execution time measurement
- Execution count tracking
- Error rate monitoring
- Slow method detection and alerting
- Micrometer integration for metrics export

**Metrics Collected**:
- `method.execution.time` - Execution duration
- `method.execution.count` - Total executions
- `method.execution.errors` - Error count by exception type

**Usage**:
```java
@MonitorPerformance(
    slowExecutionThreshold = 500L,
    logSlowExecutions = true
)
public void processLargeData() {
    // Method implementation
}
```

### 3. Security Aspect (`SecurityAspect`)

**Purpose**: Method-level security and authorization

**Features**:
- Role-based access control
- Tenant isolation validation
- Authentication verification
- Audit logging for security events

**Usage**:
```java
@RequireRole({"ADMIN", "MANAGER"})
@RequireTenant(validateOwnership = true)
public void sensitiveOperation(Long tenantId) {
    // Method implementation
}
```

### 4. Exception Handling Aspect (`ExceptionHandlingAspect`)

**Purpose**: Centralized exception handling and response formatting

**Features**:
- Automatic exception categorization
- Consistent error response format
- Security-aware error messages
- Exception logging and monitoring

**Exception Mapping**:
- `IllegalArgumentException` → HTTP 400 (Bad Request)
- `IllegalStateException` → HTTP 409 (Conflict)
- `SecurityException` → HTTP 403 (Forbidden)
- `RuntimeException` → HTTP 500 (Internal Server Error)

**Usage**:
```java
@HandleExceptions(
    logExceptions = true,
    includeStackTrace = false,
    defaultErrorMessage = "Operation failed"
)
public void riskyOperation() {
    // Method implementation
}
```

## Service Integration

### Configuration

Each service includes an `AopConfig` class:

```java
@Configuration
@EnableAspectJAutoProxy
public class AopConfig {
    // AOP configuration is handled by the common-aspects module
}
```

### Dependencies

All services include the common-aspects dependency:

```xml
<dependency>
    <groupId>com.universal.accounting</groupId>
    <artifactId>common-aspects</artifactId>
    <version>1.0.0</version>
</dependency>
```

### Annotation Usage

#### Service Layer
```java
@Service
public class AuthService {
    
    @Transactional
    @LogExecution
    @MonitorPerformance
    public AuthResponse register(RegisterRequest request) {
        // Implementation
    }
    
    @RequireRole("ADMIN")
    @LogExecution
    public List<User> getAllUsers() {
        // Implementation
    }
}
```

#### Controller Layer
```java
@RestController
public class AuthController {
    
    @PostMapping("/login")
    @LogExecution
    @MonitorPerformance
    @HandleExceptions
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Implementation
    }
}
```

## Benefits

### 1. **Separation of Concerns**
- Business logic separated from cross-cutting concerns
- Cleaner, more focused code
- Easier maintenance and testing

### 2. **Consistency**
- Uniform logging format across all services
- Standardized error responses
- Consistent performance monitoring

### 3. **Reduced Boilerplate**
- No manual logging statements
- No repetitive exception handling
- No manual performance measurement

### 4. **Centralized Configuration**
- Single point for logging configuration
- Centralized security policies
- Unified exception handling strategies

### 5. **Observability**
- Comprehensive metrics collection
- Distributed tracing support
- Performance bottleneck identification

## Logging Configuration

### Structured Logging

All logs are output in JSON format with the following structure:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "logger": "com.universal.accounting.auth.service.AuthService",
  "message": "Method execution completed: AuthService.login in 150ms",
  "service": "auth-service",
  "environment": "docker",
  "traceId": "abc12345",
  "method": "AuthService.login",
  "executionTime": 150,
  "arguments": ["***REDACTED***"],
  "result": "AuthResponse{token='***', ...}"
}
```

### Log Levels

- **DEBUG**: Detailed method execution information
- **INFO**: Method entry/exit and performance data
- **WARN**: Slow method executions and business logic issues
- **ERROR**: Exceptions and system errors

### Sensitive Data Handling

The logging aspect automatically redacts sensitive information:
- Passwords and tokens
- Personal identification data
- Financial information
- API keys and secrets

## Performance Monitoring

### Metrics Collection

Metrics are automatically collected and can be exported to:
- Prometheus (via Micrometer)
- Grafana dashboards
- Application monitoring tools

### Key Metrics

1. **Execution Time**
   - Average, median, 95th percentile
   - Per-service, per-method breakdown

2. **Throughput**
   - Requests per second
   - Concurrent execution tracking

3. **Error Rates**
   - Exception frequency by type
   - Failure rate trends

4. **Resource Usage**
   - Memory allocation
   - Database connection usage

## Security Features

### Role-Based Access Control

```java
@RequireRole({"ADMIN", "MANAGER"})
public void adminOperation() {
    // Only users with ADMIN or MANAGER roles can access
}
```

### Tenant Isolation

```java
@RequireTenant(validateOwnership = true)
public void tenantSpecificOperation(Long tenantId) {
    // Validates user has access to the specified tenant
}
```

### Audit Logging

All security-related operations are automatically logged:
- Authentication attempts
- Authorization failures
- Privilege escalations
- Data access patterns

## Exception Handling

### Automatic Exception Mapping

| Exception Type | HTTP Status | Description |
|----------------|-------------|-------------|
| `IllegalArgumentException` | 400 | Bad Request |
| `IllegalStateException` | 409 | Conflict |
| `SecurityException` | 403 | Forbidden |
| `RuntimeException` | 500 | Internal Server Error |

### Error Response Format

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input parameters",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "traceId": "abc12345"
}
```

## Best Practices

### 1. **Annotation Placement**
- Use `@LogExecution` on public methods
- Use `@MonitorPerformance` on performance-critical methods
- Use `@HandleExceptions` on controller methods
- Use `@RequireRole` and `@RequireTenant` on sensitive operations

### 2. **Performance Considerations**
- Avoid excessive logging in tight loops
- Use appropriate log levels
- Configure slow execution thresholds appropriately

### 3. **Security Guidelines**
- Always validate tenant access for multi-tenant operations
- Use principle of least privilege for role requirements
- Regularly audit security annotations

### 4. **Exception Handling**
- Let the aspect handle common exceptions
- Use specific exception types for better error categorization
- Avoid exposing internal implementation details

## Monitoring and Alerting

### Recommended Alerts

1. **Performance Alerts**
   - Method execution time > threshold
   - High error rates
   - Unusual throughput patterns

2. **Security Alerts**
   - Failed authentication attempts
   - Authorization failures
   - Unusual access patterns

3. **System Alerts**
   - Service availability
   - Resource usage thresholds
   - Exception frequency spikes

## Troubleshooting

### Common Issues

1. **Aspects Not Working**
   - Verify `@EnableAspectJAutoProxy` is present
   - Check common-aspects dependency
   - Ensure method is public and not final

2. **Performance Impact**
   - Review aspect execution overhead
   - Adjust logging levels in production
   - Consider selective aspect application

3. **Security Bypass**
   - Verify authentication context
   - Check role assignments
   - Review tenant isolation logic

### Debug Mode

Enable debug logging for aspects:

```yaml
logging:
  level:
    com.universal.accounting.common.aspects: DEBUG
```

## Migration Guide

### From Manual Logging

1. Remove `@Slf4j` annotations
2. Remove manual logging statements
3. Add appropriate AOP annotations
4. Test logging output

### From Manual Exception Handling

1. Remove try-catch blocks for common exceptions
2. Add `@HandleExceptions` annotation
3. Update error response format expectations
4. Test exception scenarios

## Future Enhancements

### Planned Features

1. **Circuit Breaker Aspect**
   - Automatic failure detection
   - Service degradation handling

2. **Caching Aspect**
   - Method result caching
   - Cache invalidation strategies

3. **Validation Aspect**
   - Automatic input validation
   - Custom validation rules

4. **Audit Aspect**
   - Comprehensive audit trails
   - Compliance reporting

## Conclusion

The AOP integration provides a robust foundation for cross-cutting concerns in the Universal Accounting Platform. It promotes clean code, improves observability, and enhances security while reducing boilerplate code and improving maintainability.
