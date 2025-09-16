package com.universal.accounting.common.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * AOP Aspect for centralized exception handling
 * Provides consistent error responses and logging
 */
@Aspect
@Component
public class ExceptionHandlingAspect {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandlingAspect.class);

    @Around("@annotation(com.universal.accounting.common.aspects.HandleExceptions)")
    public Object handleExceptions(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            return joinPoint.proceed();
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error in method {}: {}", getMethodName(joinPoint), e.getMessage());
            return createErrorResponse(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", e.getMessage());
        } catch (IllegalStateException e) {
            logger.warn("Business logic error in method {}: {}", getMethodName(joinPoint), e.getMessage());
            return createErrorResponse(HttpStatus.CONFLICT, "BUSINESS_LOGIC_ERROR", e.getMessage());
        } catch (SecurityException e) {
            logger.warn("Security error in method {}: {}", getMethodName(joinPoint), e.getMessage());
            return createErrorResponse(HttpStatus.FORBIDDEN, "SECURITY_ERROR", e.getMessage());
        } catch (RuntimeException e) {
            logger.error("Runtime error in method {}: {}", getMethodName(joinPoint), e.getMessage(), e);
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "RUNTIME_ERROR", "An unexpected error occurred");
        } catch (Exception e) {
            logger.error("Unexpected error in method {}: {}", getMethodName(joinPoint), e.getMessage(), e);
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "UNEXPECTED_ERROR", "An unexpected error occurred");
        }
    }
    
    @Around("execution(* com.universal.accounting..controller.*.*(..))")
    public Object handleControllerExceptions(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            return joinPoint.proceed();
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error in controller method {}: {}", getMethodName(joinPoint), e.getMessage());
            return ResponseEntity.badRequest()
                    .body(createErrorMap("VALIDATION_ERROR", e.getMessage()));
        } catch (IllegalStateException e) {
            logger.warn("Business logic error in controller method {}: {}", getMethodName(joinPoint), e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createErrorMap("BUSINESS_LOGIC_ERROR", e.getMessage()));
        } catch (SecurityException e) {
            logger.warn("Security error in controller method {}: {}", getMethodName(joinPoint), e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorMap("SECURITY_ERROR", e.getMessage()));
        } catch (RuntimeException e) {
            logger.error("Runtime error in controller method {}: {}", getMethodName(joinPoint), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorMap("RUNTIME_ERROR", "An unexpected error occurred"));
        } catch (Exception e) {
            logger.error("Unexpected error in controller method {}: {}", getMethodName(joinPoint), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorMap("UNEXPECTED_ERROR", "An unexpected error occurred"));
        }
    }
    
    private ResponseEntity<Map<String, Object>> createErrorResponse(HttpStatus status, String errorCode, String message) {
        Map<String, Object> errorResponse = createErrorMap(errorCode, message);
        return ResponseEntity.status(status).body(errorResponse);
    }
    
    private Map<String, Object> createErrorMap(String errorCode, String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", errorCode);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", LocalDateTime.now());
        return errorResponse;
    }
    
    private String getMethodName(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        return signature.getDeclaringType().getSimpleName() + "." + signature.getName();
    }
}
