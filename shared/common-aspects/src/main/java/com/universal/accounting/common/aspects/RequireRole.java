package com.universal.accounting.common.aspects;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods that require specific roles for access
 * Automatically checks user roles before method execution
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRole {
    
    /**
     * Required roles for method access
     * User must have at least one of these roles
     */
    String[] value();
    
    /**
     * Whether to check for all roles (AND) or any role (OR)
     * Defaults to OR (any role)
     */
    boolean requireAll() default false;
}
