package com.universal.accounting.common.aspects;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods for automatic execution logging
 * Can be used on any method to enable detailed logging
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecution {
    
    /**
     * Custom log level for this method execution
     * Defaults to INFO level
     */
    LogLevel level() default LogLevel.INFO;
    
    /**
     * Whether to include method arguments in the log
     * Defaults to true
     */
    boolean includeArgs() default true;
    
    /**
     * Whether to include method result in the log
     * Defaults to true
     */
    boolean includeResult() default true;
    
    /**
     * Custom message to include in the log
     */
    String message() default "";
    
    enum LogLevel {
        DEBUG, INFO, WARN, ERROR
    }
}
