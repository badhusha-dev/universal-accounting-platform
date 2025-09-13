package com.universal.accounting.ledger.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class LedgerDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateJournalEntryRequest {
        @NotNull(message = "Entry date is required")
        private LocalDate entryDate;
        
        @NotBlank(message = "Description is required")
        private String description;
        
        private String reference;
        
        @NotNull(message = "Lines are required")
        private List<JournalEntryLineRequest> lines;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JournalEntryLineRequest {
        @NotNull(message = "Account ID is required")
        private Long accountId;
        
        private String description;
        
        @Positive(message = "Debit amount must be positive")
        private BigDecimal debitAmount;
        
        @Positive(message = "Credit amount must be positive")
        private BigDecimal creditAmount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JournalEntryResponse {
        private Long id;
        private Long tenantId;
        private String entryNumber;
        private LocalDate entryDate;
        private String description;
        private String reference;
        private String status;
        private BigDecimal totalDebit;
        private BigDecimal totalCredit;
        private List<JournalEntryLineResponse> lines;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class JournalEntryLineResponse {
        private Long id;
        private Long accountId;
        private String accountName;
        private String accountCode;
        private String description;
        private BigDecimal debitAmount;
        private BigDecimal creditAmount;
        private Integer lineNumber;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrialBalanceResponse {
        private Long accountId;
        private String accountCode;
        private String accountName;
        private String accountType;
        private BigDecimal debitBalance;
        private BigDecimal creditBalance;
    }
}
