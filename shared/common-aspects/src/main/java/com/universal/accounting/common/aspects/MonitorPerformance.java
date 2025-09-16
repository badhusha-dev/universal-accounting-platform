package com.universal.accounting.common.aspects;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods for performance monitoring
 * Automatically tracks execution time and counts
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MonitorPerformance {
    
    /**
     * Custom metric name prefix
     * If not specified, uses default naming convention
     */
    String metricName() default "";
    
    /**
     * Additional tags for the metric
     */
    String[] tags() default {};
    
    /**
     * Whether to log slow executions
     * Defaults to true
     */
    boolean logSlowExecutions() default true;
    
    /**
     * Threshold for slow execution logging (in milliseconds)
     * Defaults to 1000ms
     */
    long slowExecutionThreshold() default 1000L;
}
