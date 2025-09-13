package com.universal.accounting.common.models;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "journal_entries")
@EqualsAndHashCode(callSuper = true)
public class JournalEntry extends BaseEntity {
    
    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
    
    @Column(name = "entry_number", nullable = false, length = 50)
    private String entryNumber;
    
    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "reference", length = 100)
    private String reference;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntryStatus status = EntryStatus.DRAFT;
    
    @Column(name = "total_debit", precision = 19, scale = 2)
    private BigDecimal totalDebit = BigDecimal.ZERO;
    
    @Column(name = "total_credit", precision = 19, scale = 2)
    private BigDecimal totalCredit = BigDecimal.ZERO;
    
    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JournalEntryLine> lines;
    
    public enum EntryStatus {
        DRAFT, POSTED, REVERSED
    }
}