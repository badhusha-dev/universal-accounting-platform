package com.universal.accounting.ledger.repository;

import com.universal.accounting.common.models.JournalEntry;
import com.universal.accounting.common.models.JournalEntryLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByTenantIdOrderByEntryDateDesc(Long tenantId);
    
    @Query("SELECT je FROM JournalEntry je WHERE je.tenantId = :tenantId AND je.entryDate BETWEEN :startDate AND :endDate ORDER BY je.entryDate DESC")
    List<JournalEntry> findByTenantIdAndEntryDateBetween(@Param("tenantId") Long tenantId, 
                                                         @Param("startDate") LocalDate startDate, 
                                                         @Param("endDate") LocalDate endDate);
}

@Repository
interface JournalEntryLineRepository extends JpaRepository<JournalEntryLine, Long> {
    List<JournalEntryLine> findByJournalEntryId(Long journalEntryId);
    
    @Query("SELECT jel FROM JournalEntryLine jel WHERE jel.accountId = :accountId AND jel.journalEntry.tenantId = :tenantId")
    List<JournalEntryLine> findByAccountIdAndTenantId(@Param("accountId") Long accountId, @Param("tenantId") Long tenantId);
}
