package com.universal.accounting.reports.service;

import com.universal.accounting.event.contracts.Events;
import com.universal.accounting.reports.dto.ReportsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportsService {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    public ReportsDto.ProfitLossResponse generateProfitLossReport(Long tenantId, LocalDate startDate, LocalDate endDate) {
        // Mock data - in real implementation, this would query the database
        List<ReportsDto.ProfitLossItem> revenueItems = Arrays.asList(
                ReportsDto.ProfitLossItem.builder()
                        .accountName("Sales Revenue")
                        .accountCode("4000")
                        .amount(new BigDecimal("50000.00"))
                        .build(),
                ReportsDto.ProfitLossItem.builder()
                        .accountName("Service Revenue")
                        .accountCode("4100")
                        .amount(new BigDecimal("15000.00"))
                        .build()
        );
        
        List<ReportsDto.ProfitLossItem> expenseItems = Arrays.asList(
                ReportsDto.ProfitLossItem.builder()
                        .accountName("Office Rent")
                        .accountCode("6000")
                        .amount(new BigDecimal("5000.00"))
                        .build(),
                ReportsDto.ProfitLossItem.builder()
                        .accountName("Salaries")
                        .accountCode("6100")
                        .amount(new BigDecimal("25000.00"))
                        .build(),
                ReportsDto.ProfitLossItem.builder()
                        .accountName("Utilities")
                        .accountCode("6200")
                        .amount(new BigDecimal("2000.00"))
                        .build()
        );
        
        BigDecimal totalRevenue = revenueItems.stream()
                .map(ReportsDto.ProfitLossItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalExpenses = expenseItems.stream()
                .map(ReportsDto.ProfitLossItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal netIncome = totalRevenue.subtract(totalExpenses);
        
        // Publish report generated event
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("startDate", startDate);
        parameters.put("endDate", endDate);
        parameters.put("reportType", "PROFIT_LOSS");
        
        Events.ReportGenerated event = new Events.ReportGenerated(
                tenantId,
                "PROFIT_LOSS",
                "Profit & Loss Report",
                LocalDateTime.now(),
                "system",
                parameters
        );
        kafkaTemplate.send("report-events", event);
        
        return ReportsDto.ProfitLossResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalRevenue(totalRevenue)
                .totalExpenses(totalExpenses)
                .netIncome(netIncome)
                .revenueItems(revenueItems)
                .expenseItems(expenseItems)
                .build();
    }
    
    public ReportsDto.BalanceSheetResponse generateBalanceSheetReport(Long tenantId, LocalDate asOfDate) {
        // Mock data - in real implementation, this would query the database
        List<ReportsDto.BalanceSheetItem> assets = Arrays.asList(
                ReportsDto.BalanceSheetItem.builder()
                        .accountName("Cash")
                        .accountCode("1000")
                        .amount(new BigDecimal("25000.00"))
                        .build(),
                ReportsDto.BalanceSheetItem.builder()
                        .accountName("Accounts Receivable")
                        .accountCode("1100")
                        .amount(new BigDecimal("15000.00"))
                        .build(),
                ReportsDto.BalanceSheetItem.builder()
                        .accountName("Equipment")
                        .accountCode("1500")
                        .amount(new BigDecimal("30000.00"))
                        .build()
        );
        
        List<ReportsDto.BalanceSheetItem> liabilities = Arrays.asList(
                ReportsDto.BalanceSheetItem.builder()
                        .accountName("Accounts Payable")
                        .accountCode("2000")
                        .amount(new BigDecimal("8000.00"))
                        .build(),
                ReportsDto.BalanceSheetItem.builder()
                        .accountName("Accrued Expenses")
                        .accountCode("2100")
                        .amount(new BigDecimal("2000.00"))
                        .build()
        );
        
        List<ReportsDto.BalanceSheetItem> equity = Arrays.asList(
                ReportsDto.BalanceSheetItem.builder()
                        .accountName("Owner's Equity")
                        .accountCode("3000")
                        .amount(new BigDecimal("60000.00"))
                        .build()
        );
        
        BigDecimal totalAssets = assets.stream()
                .map(ReportsDto.BalanceSheetItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalLiabilities = liabilities.stream()
                .map(ReportsDto.BalanceSheetItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalEquity = equity.stream()
                .map(ReportsDto.BalanceSheetItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Publish report generated event
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("asOfDate", asOfDate);
        parameters.put("reportType", "BALANCE_SHEET");
        
        Events.ReportGenerated event = new Events.ReportGenerated(
                tenantId,
                "BALANCE_SHEET",
                "Balance Sheet Report",
                LocalDateTime.now(),
                "system",
                parameters
        );
        kafkaTemplate.send("report-events", event);
        
        return ReportsDto.BalanceSheetResponse.builder()
                .asOfDate(asOfDate)
                .totalAssets(totalAssets)
                .totalLiabilities(totalLiabilities)
                .totalEquity(totalEquity)
                .assets(assets)
                .liabilities(liabilities)
                .equity(equity)
                .build();
    }
    
    public ReportsDto.TrialBalanceResponse generateTrialBalanceReport(Long tenantId, LocalDate asOfDate) {
        // Mock data - in real implementation, this would query the database
        List<ReportsDto.TrialBalanceItem> items = Arrays.asList(
                ReportsDto.TrialBalanceItem.builder()
                        .accountName("Cash")
                        .accountCode("1000")
                        .accountType("ASSET")
                        .debitBalance(new BigDecimal("25000.00"))
                        .creditBalance(BigDecimal.ZERO)
                        .build(),
                ReportsDto.TrialBalanceItem.builder()
                        .accountName("Accounts Receivable")
                        .accountCode("1100")
                        .accountType("ASSET")
                        .debitBalance(new BigDecimal("15000.00"))
                        .creditBalance(BigDecimal.ZERO)
                        .build(),
                ReportsDto.TrialBalanceItem.builder()
                        .accountName("Accounts Payable")
                        .accountCode("2000")
                        .accountType("LIABILITY")
                        .debitBalance(BigDecimal.ZERO)
                        .creditBalance(new BigDecimal("8000.00"))
                        .build(),
                ReportsDto.TrialBalanceItem.builder()
                        .accountName("Sales Revenue")
                        .accountCode("4000")
                        .accountType("REVENUE")
                        .debitBalance(BigDecimal.ZERO)
                        .creditBalance(new BigDecimal("50000.00"))
                        .build()
        );
        
        // Publish report generated event
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("asOfDate", asOfDate);
        parameters.put("reportType", "TRIAL_BALANCE");
        
        Events.ReportGenerated event = new Events.ReportGenerated(
                tenantId,
                "TRIAL_BALANCE",
                "Trial Balance Report",
                LocalDateTime.now(),
                "system",
                parameters
        );
        kafkaTemplate.send("report-events", event);
        
        return ReportsDto.TrialBalanceResponse.builder()
                .asOfDate(asOfDate)
                .items(items)
                .build();
    }
}
