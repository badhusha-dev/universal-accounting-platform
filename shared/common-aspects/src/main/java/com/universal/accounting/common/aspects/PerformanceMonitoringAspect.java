package com.universal.accounting.common.aspects;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * AOP Aspect for performance monitoring and metrics collection
 * Automatically tracks method execution times and counts
 */
@Aspect
@Component
public class PerformanceMonitoringAspect {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceMonitoringAspect.class);
    
    @Autowired
    private MeterRegistry meterRegistry;

    @Around("@annotation(com.universal.accounting.common.aspects.MonitorPerformance) || " +
            "execution(* com.universal.accounting..service.*.*(..)) || " +
            "execution(* com.universal.accounting..controller.*.*(..))")
    public Object monitorPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String className = method.getDeclaringClass().getSimpleName();
        String methodName = method.getName();
        String serviceName = extractServiceName(className);
        
        // Create timer and counter metrics
        Timer timer = Timer.builder("method.execution.time")
                .description("Method execution time")
                .tag("service", serviceName)
                .tag("class", className)
                .tag("method", methodName)
                .register(meterRegistry);
        
        Counter counter = Counter.builder("method.execution.count")
                .description("Method execution count")
                .tag("service", serviceName)
                .tag("class", className)
                .tag("method", methodName)
                .register(meterRegistry);
        
        // Execute method and record metrics
        Timer.Sample sample = Timer.start(meterRegistry);
        
        try {
            Object result = joinPoint.proceed();
            counter.increment();
            return result;
        } catch (Throwable throwable) {
            // Record failed executions
            Counter errorCounter = Counter.builder("method.execution.errors")
                    .description("Method execution errors")
                    .tag("service", serviceName)
                    .tag("class", className)
                    .tag("method", methodName)
                    .tag("error", throwable.getClass().getSimpleName())
                    .register(meterRegistry);
            errorCounter.increment();
            throw throwable;
        } finally {
            sample.stop(timer);
            
            // Log slow methods (>1 second)
            long executionTime = (long) timer.totalTime(java.util.concurrent.TimeUnit.MILLISECONDS);
            if (executionTime > 1000) {
                logger.warn("Slow method execution detected: {}.{} took {}ms", 
                           className, methodName, executionTime);
            }
        }
    }
    
    private String extractServiceName(String className) {
        if (className.contains("Auth")) return "auth-service";
        if (className.contains("Tenant")) return "tenant-service";
        if (className.contains("Ledger")) return "ledger-service";
        if (className.contains("Reports")) return "reports-service";
        if (className.contains("Gateway")) return "gateway";
        return "unknown-service";
    }
}
