package com.universal.accounting.common.aspects;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods for centralized exception handling
 * Automatically handles common exceptions and returns appropriate responses
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface HandleExceptions {
    
    /**
     * Whether to log exceptions
     * Defaults to true
     */
    boolean logExceptions() default true;
    
    /**
     * Whether to include stack trace in error responses
     * Defaults to false for security
     */
    boolean includeStackTrace() default false;
    
    /**
     * Custom error message for unexpected errors
     */
    String defaultErrorMessage() default "An unexpected error occurred";
}
