package com.universal.accounting.ledger.controller;

import com.universal.accounting.ledger.dto.LedgerDto;
import com.universal.accounting.ledger.service.JournalEntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
public class LedgerController {
    
    private final JournalEntryService journalEntryService;
    
    @PostMapping("/journal-entries")
    public ResponseEntity<LedgerDto.JournalEntryResponse> createJournalEntry(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @Valid @RequestBody LedgerDto.CreateJournalEntryRequest request) {
        LedgerDto.JournalEntryResponse response = journalEntryService.createJournalEntry(tenantId, request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/journal-entries/{entryId}/post")
    public ResponseEntity<LedgerDto.JournalEntryResponse> postJournalEntry(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long entryId) {
        LedgerDto.JournalEntryResponse response = journalEntryService.postJournalEntry(tenantId, entryId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/journal-entries")
    public ResponseEntity<List<LedgerDto.JournalEntryResponse>> getJournalEntries(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<LedgerDto.JournalEntryResponse> responses = journalEntryService.getJournalEntries(tenantId, startDate, endDate);
        return ResponseEntity.ok(responses);
    }
    
    @GetMapping("/journal-entries/{entryId}")
    public ResponseEntity<LedgerDto.JournalEntryResponse> getJournalEntry(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long entryId) {
        LedgerDto.JournalEntryResponse response = journalEntryService.getJournalEntry(tenantId, entryId);
        return ResponseEntity.ok(response);
    }
}
