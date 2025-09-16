package com.universal.accounting.common.aspects;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods that require tenant validation
 * Automatically checks tenant access before method execution
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireTenant {
    
    /**
     * Whether to validate tenant ownership
     * Defaults to true
     */
    boolean validateOwnership() default true;
    
    /**
     * Whether to allow admin users to bypass tenant restrictions
     * Defaults to true
     */
    boolean allowAdminBypass() default true;
}
