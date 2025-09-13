package com.universal.accounting.common.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "chart_of_accounts")
@EqualsAndHashCode(callSuper = true)
public class ChartOfAccount extends BaseEntity {
    
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    @Column(name = "account_code", nullable = false, length = 20)
    private String accountCode;
    
    @Column(name = "account_name", nullable = false, length = 100)
    private String accountName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "account_class", nullable = false)
    private AccountClass accountClass;
    
    @Column(name = "parent_account_id")
    private Long parentAccountId;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "opening_balance", precision = 19, scale = 2)
    private BigDecimal openingBalance = BigDecimal.ZERO;
    
    @Column(name = "description", length = 500)
    private String description;
    
    public enum AccountType {
        ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    }
    
    public enum AccountClass {
        CURRENT_ASSET, FIXED_ASSET, CURRENT_LIABILITY, LONG_TERM_LIABILITY,
        OWNERS_EQUITY, REVENUE, OPERATING_EXPENSE, NON_OPERATING_EXPENSE
    }
}