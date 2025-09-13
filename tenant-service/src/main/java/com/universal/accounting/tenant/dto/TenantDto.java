package com.universal.accounting.tenant.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class TenantDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Tenant name is required")
        @Size(max = 100, message = "Tenant name must not exceed 100 characters")
        private String name;
        
        @NotBlank(message = "Business type is required")
        private String businessType;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Email should be valid")
        private String email;
        
        private String phone;
        private String address;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private LocalDate fiscalYearStart;
        private String currencyCode;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String name;
        private String businessType;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private LocalDate fiscalYearStart;
        private String currencyCode;
        private Boolean isActive;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String businessType;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private LocalDate fiscalYearStart;
        private String currencyCode;
        private Boolean isActive;
        private String schemaName;
    }
}
