package com.universal.accounting.reports.controller;

import com.universal.accounting.reports.dto.ReportsDto;
import com.universal.accounting.reports.service.ReportsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {
    
    private final ReportsService reportsService;
    
    @GetMapping("/profit-loss")
    public ResponseEntity<ReportsDto.ProfitLossResponse> getProfitLossReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ReportsDto.ProfitLossResponse response = reportsService.generateProfitLossReport(tenantId, startDate, endDate);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/balance-sheet")
    public ResponseEntity<ReportsDto.BalanceSheetResponse> getBalanceSheetReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOfDate) {
        ReportsDto.BalanceSheetResponse response = reportsService.generateBalanceSheetReport(tenantId, asOfDate);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/trial-balance")
    public ResponseEntity<ReportsDto.TrialBalanceResponse> getTrialBalanceReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate asOfDate) {
        ReportsDto.TrialBalanceResponse response = reportsService.generateTrialBalanceReport(tenantId, asOfDate);
        return ResponseEntity.ok(response);
    }
}
