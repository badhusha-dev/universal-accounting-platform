package com.universal.accounting.reports.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ReportsDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfitLossResponse {
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal totalRevenue;
        private BigDecimal totalExpenses;
        private BigDecimal netIncome;
        private List<ProfitLossItem> revenueItems;
        private List<ProfitLossItem> expenseItems;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfitLossItem {
        private String accountName;
        private String accountCode;
        private BigDecimal amount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BalanceSheetResponse {
        private LocalDate asOfDate;
        private BigDecimal totalAssets;
        private BigDecimal totalLiabilities;
        private BigDecimal totalEquity;
        private List<BalanceSheetItem> assets;
        private List<BalanceSheetItem> liabilities;
        private List<BalanceSheetItem> equity;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BalanceSheetItem {
        private String accountName;
        private String accountCode;
        private BigDecimal amount;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrialBalanceResponse {
        private LocalDate asOfDate;
        private List<TrialBalanceItem> items;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrialBalanceItem {
        private String accountName;
        private String accountCode;
        private String accountType;
        private BigDecimal debitBalance;
        private BigDecimal creditBalance;
    }
}
