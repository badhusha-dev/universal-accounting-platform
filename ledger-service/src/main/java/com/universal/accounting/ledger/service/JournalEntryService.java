package com.universal.accounting.ledger.service;

import com.universal.accounting.common.models.JournalEntry;
import com.universal.accounting.common.models.JournalEntryLine;
import com.universal.accounting.event.contracts.Events;
import com.universal.accounting.ledger.dto.LedgerDto;
import com.universal.accounting.ledger.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JournalEntryService {
    
    private final JournalEntryRepository journalEntryRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    
    @Transactional
    public LedgerDto.JournalEntryResponse createJournalEntry(Long tenantId, LedgerDto.CreateJournalEntryRequest request) {
        // Validate double-entry bookkeeping
        BigDecimal totalDebit = request.getLines().stream()
                .map(line -> line.getDebitAmount() != null ? line.getDebitAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalCredit = request.getLines().stream()
                .map(line -> line.getCreditAmount() != null ? line.getCreditAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new RuntimeException("Total debits must equal total credits");
        }
        
        // Generate entry number
        String entryNumber = "JE-" + System.currentTimeMillis();
        
        JournalEntry journalEntry = JournalEntry.builder()
                .tenantId(tenantId)
                .entryNumber(entryNumber)
                .entryDate(request.getEntryDate())
                .description(request.getDescription())
                .reference(request.getReference())
                .status(JournalEntry.EntryStatus.DRAFT)
                .totalDebit(totalDebit)
                .totalCredit(totalCredit)
                .build();
        
        journalEntry = journalEntryRepository.save(journalEntry);
        final JournalEntry finalJournalEntry = journalEntry;
        
        // Create journal entry lines
        List<JournalEntryLine> lines = request.getLines().stream()
                .map(lineRequest -> JournalEntryLine.builder()
                        .journalEntry(finalJournalEntry)
                        .accountId(lineRequest.getAccountId())
                        .description(lineRequest.getDescription())
                        .debitAmount(lineRequest.getDebitAmount() != null ? lineRequest.getDebitAmount() : BigDecimal.ZERO)
                        .creditAmount(lineRequest.getCreditAmount() != null ? lineRequest.getCreditAmount() : BigDecimal.ZERO)
                        .build())
                .collect(Collectors.toList());
        
        journalEntry.setLines(lines);
        journalEntry = journalEntryRepository.save(journalEntry);
        
        // Publish journal entry created event
        Events.JournalEntryCreated event = new Events.JournalEntryCreated(
                tenantId,
                journalEntry.getId(),
                journalEntry.getEntryNumber(),
                LocalDateTime.now(),
                "system"
        );
        kafkaTemplate.send("ledger-events", event);
        
        return mapToResponse(journalEntry);
    }
    
    @Transactional
    public LedgerDto.JournalEntryResponse postJournalEntry(Long tenantId, Long entryId) {
        JournalEntry journalEntry = journalEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));
        
        if (!journalEntry.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Access denied");
        }
        
        if (journalEntry.getStatus() != JournalEntry.EntryStatus.DRAFT) {
            throw new RuntimeException("Only draft entries can be posted");
        }
        
        journalEntry.setStatus(JournalEntry.EntryStatus.POSTED);
        journalEntry = journalEntryRepository.save(journalEntry);
        
        // Publish journal entry posted event
        Events.JournalEntryPosted event = new Events.JournalEntryPosted(
                tenantId,
                journalEntry.getId(),
                journalEntry.getEntryNumber(),
                LocalDateTime.now(),
                "system"
        );
        kafkaTemplate.send("ledger-events", event);
        
        return mapToResponse(journalEntry);
    }
    
    public List<LedgerDto.JournalEntryResponse> getJournalEntries(Long tenantId, LocalDate startDate, LocalDate endDate) {
        List<JournalEntry> entries;
        if (startDate != null && endDate != null) {
            entries = journalEntryRepository.findByTenantIdAndEntryDateBetween(tenantId, startDate, endDate);
        } else {
            entries = journalEntryRepository.findByTenantIdOrderByEntryDateDesc(tenantId);
        }
        
        return entries.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public LedgerDto.JournalEntryResponse getJournalEntry(Long tenantId, Long entryId) {
        JournalEntry journalEntry = journalEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Journal entry not found"));
        
        if (!journalEntry.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Access denied");
        }
        
        return mapToResponse(journalEntry);
    }
    
    private LedgerDto.JournalEntryResponse mapToResponse(JournalEntry journalEntry) {
        List<LedgerDto.JournalEntryLineResponse> lineResponses = journalEntry.getLines().stream()
                .map(line -> LedgerDto.JournalEntryLineResponse.builder()
                        .id(line.getId())
                        .accountId(line.getAccountId())
                        .accountName("Account " + line.getAccountId()) // This should be fetched from Chart of Accounts
                        .accountCode("ACC" + line.getAccountId())
                        .description(line.getDescription())
                        .debitAmount(line.getDebitAmount())
                        .creditAmount(line.getCreditAmount())
                        .lineNumber(line.getLineNumber())
                        .build())
                .collect(Collectors.toList());
        
        return LedgerDto.JournalEntryResponse.builder()
                .id(journalEntry.getId())
                .tenantId(journalEntry.getTenantId())
                .entryNumber(journalEntry.getEntryNumber())
                .entryDate(journalEntry.getEntryDate())
                .description(journalEntry.getDescription())
                .reference(journalEntry.getReference())
                .status(journalEntry.getStatus().name())
                .totalDebit(journalEntry.getTotalDebit())
                .totalCredit(journalEntry.getTotalCredit())
                .lines(lineResponses)
                .build();
    }
}
