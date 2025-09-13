package com.universal.accounting.common.models;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "journal_entry_lines")
@EqualsAndHashCode(callSuper = true)
public class JournalEntryLine extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id", nullable = false)
    private JournalEntry journalEntry;
    
    @Column(name = "account_id", nullable = false)
    private Long accountId;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "debit_amount", precision = 19, scale = 2)
    private BigDecimal debitAmount = BigDecimal.ZERO;
    
    @Column(name = "credit_amount", precision = 19, scale = 2)
    private BigDecimal creditAmount = BigDecimal.ZERO;
    
    @Column(name = "line_number")
    private Integer lineNumber;
}