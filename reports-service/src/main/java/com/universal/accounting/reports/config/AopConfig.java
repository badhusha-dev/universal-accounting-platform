package com.universal.accounting.reports.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * Configuration class to enable Aspect-Oriented Programming
 * This enables all AOP aspects from the common-aspects module
 */
@Configuration
@EnableAspectJAutoProxy
public class AopConfig {
    // AOP configuration is handled by the common-aspects module
    // This class just enables AOP support in this service
}
