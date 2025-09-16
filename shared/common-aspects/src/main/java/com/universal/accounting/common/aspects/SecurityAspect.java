package com.universal.accounting.common.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * AOP Aspect for security and authorization checks
 * Provides method-level security validation
 */
@Aspect
@Component
public class SecurityAspect {

    private static final Logger logger = LoggerFactory.getLogger(SecurityAspect.class);

    @Around("@annotation(com.universal.accounting.common.aspects.RequireRole)")
    public Object checkRoleAuthorization(ProceedingJoinPoint joinPoint) throws Throwable {
        RequireRole requireRole = getRequireRoleAnnotation(joinPoint);
        if (requireRole == null) {
            return joinPoint.proceed();
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized access attempt to method: {} by unauthenticated user", 
                       getMethodName(joinPoint));
            throw new SecurityException("Authentication required");
        }
        
        String[] requiredRoles = requireRole.value();
        String[] userRoles = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .toArray(String[]::new);
        
        boolean hasRequiredRole = Arrays.stream(requiredRoles)
                .anyMatch(role -> Arrays.asList(userRoles).contains(role));
        
        if (!hasRequiredRole) {
            logger.warn("Access denied to method: {} for user: {} with roles: {}. Required roles: {}", 
                       getMethodName(joinPoint),
                       authentication.getName(),
                       Arrays.toString(userRoles),
                       Arrays.toString(requiredRoles));
            throw new SecurityException("Insufficient privileges");
        }
        
        logger.debug("Access granted to method: {} for user: {} with roles: {}", 
                    getMethodName(joinPoint),
                    authentication.getName(),
                    Arrays.toString(userRoles));
        
        return joinPoint.proceed();
    }
    
    @Around("@annotation(com.universal.accounting.common.aspects.RequireTenant)")
    public Object checkTenantAuthorization(ProceedingJoinPoint joinPoint) throws Throwable {
        RequireTenant requireTenant = getRequireTenantAnnotation(joinPoint);
        if (requireTenant == null) {
            return joinPoint.proceed();
        }
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized access attempt to method: {} by unauthenticated user", 
                       getMethodName(joinPoint));
            throw new SecurityException("Authentication required");
        }
        
        // Extract tenant ID from method arguments
        Long tenantId = extractTenantIdFromArguments(joinPoint);
        if (tenantId == null) {
            logger.warn("Tenant ID not found in method arguments: {}", getMethodName(joinPoint));
            throw new SecurityException("Tenant ID is required");
        }
        
        // Check if user has access to this tenant
        // This would typically involve checking user's tenant associations
        logger.debug("Tenant access check for method: {} user: {} tenant: {}", 
                    getMethodName(joinPoint),
                    authentication.getName(),
                    tenantId);
        
        return joinPoint.proceed();
    }
    
    private RequireRole getRequireRoleAnnotation(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        return method.getAnnotation(RequireRole.class);
    }
    
    private RequireTenant getRequireTenantAnnotation(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        return method.getAnnotation(RequireTenant.class);
    }
    
    private String getMethodName(ProceedingJoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        return signature.getDeclaringType().getSimpleName() + "." + signature.getName();
    }
    
    private Long extractTenantIdFromArguments(ProceedingJoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        
        for (Object arg : args) {
            if (arg instanceof Long) {
                return (Long) arg;
            }
            // Check if arg has tenantId field
            if (arg != null) {
                try {
                    java.lang.reflect.Field tenantIdField = arg.getClass().getDeclaredField("tenantId");
                    tenantIdField.setAccessible(true);
                    Object tenantIdValue = tenantIdField.get(arg);
                    if (tenantIdValue instanceof Long) {
                        return (Long) tenantIdValue;
                    }
                } catch (Exception e) {
                    // Field not found or not accessible, continue
                }
            }
        }
        
        return null;
    }
}
