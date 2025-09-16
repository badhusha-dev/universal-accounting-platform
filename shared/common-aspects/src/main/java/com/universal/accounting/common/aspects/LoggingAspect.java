package com.universal.accounting.common.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

/**
 * AOP Aspect for automatic method execution logging
 * Provides consistent logging across all service methods
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("@annotation(com.universal.accounting.common.aspects.LogExecution) || " +
            "execution(* com.universal.accounting..service.*.*(..)) || " +
            "execution(* com.universal.accounting..controller.*.*(..))")
    public Object logMethodExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String traceId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put("traceId", traceId);
        
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String className = method.getDeclaringClass().getSimpleName();
        String methodName = method.getName();
        String fullMethodName = className + "." + methodName;
        
        Object[] args = joinPoint.getArgs();
        
        long startTime = System.currentTimeMillis();
        
        // Log method entry
        logger.info("Method execution started: {} with args: {}", 
                   fullMethodName, 
                   sanitizeArguments(args));
        
        Object result = null;
        Throwable exception = null;
        
        try {
            result = joinPoint.proceed();
            return result;
        } catch (Throwable t) {
            exception = t;
            throw t;
        } finally {
            long executionTime = System.currentTimeMillis() - startTime;
            
            // Log method exit
            if (exception != null) {
                logger.error("Method execution failed: {} in {}ms with exception: {}", 
                           fullMethodName, 
                           executionTime,
                           exception.getMessage(), 
                           exception);
            } else {
                logger.info("Method execution completed: {} in {}ms with result: {}", 
                           fullMethodName, 
                           executionTime,
                           sanitizeResult(result));
            }
            
            MDC.remove("traceId");
        }
    }
    
    private String sanitizeArguments(Object[] args) {
        if (args == null || args.length == 0) {
            return "[]";
        }
        
        return Arrays.toString(Arrays.stream(args)
            .map(this::sanitizeArgument)
            .toArray());
    }
    
    private Object sanitizeArgument(Object arg) {
        if (arg == null) {
            return null;
        }
        
        // Don't log sensitive data
        String className = arg.getClass().getSimpleName().toLowerCase();
        if (className.contains("password") || className.contains("secret") || 
            className.contains("token") || className.contains("key")) {
            return "***REDACTED***";
        }
        
        // Limit string length
        if (arg instanceof String) {
            String str = (String) arg;
            return str.length() > 200 ? str.substring(0, 200) + "..." : str;
        }
        
        return arg;
    }
    
    private Object sanitizeResult(Object result) {
        if (result == null) {
            return "null";
        }
        
        // Don't log large collections or complex objects
        if (result instanceof java.util.Collection) {
            java.util.Collection<?> collection = (java.util.Collection<?>) result;
            return "Collection[size=" + collection.size() + "]";
        }
        
        if (result instanceof java.util.Map) {
            java.util.Map<?, ?> map = (java.util.Map<?, ?>) result;
            return "Map[size=" + map.size() + "]";
        }
        
        return sanitizeArgument(result);
    }
}
