package com.universal.accounting.common.models;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tenants")
@EqualsAndHashCode(callSuper = true)
public class Tenant extends BaseEntity {
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "business_type", nullable = false, length = 50)
    private String businessType;
    
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "address", length = 500)
    private String address;
    
    @Column(name = "city", length = 100)
    private String city;
    
    @Column(name = "state", length = 100)
    private String state;
    
    @Column(name = "country", length = 100)
    private String country;
    
    @Column(name = "postal_code", length = 20)
    private String postalCode;
    
    @Column(name = "fiscal_year_start")
    private LocalDate fiscalYearStart;
    
    @Column(name = "currency_code", length = 3)
    private String currencyCode = "USD";
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "schema_name", length = 50)
    private String schemaName;
}