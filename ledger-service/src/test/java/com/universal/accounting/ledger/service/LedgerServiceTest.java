package com.universal.accounting.ledger.service;

import com.universal.accounting.ledger.dto.LedgerDto;
import com.universal.accounting.ledger.entity.JournalEntry;
import com.universal.accounting.ledger.entity.JournalEntryLine;
import com.universal.accounting.ledger.repository.JournalEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LedgerServiceTest {

    @Mock
    private JournalEntryRepository journalEntryRepository;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private LedgerService ledgerService;

    private JournalEntry testJournalEntry;
    private LedgerDto.CreateJournalEntryRequest createRequest;
    private LedgerDto.UpdateJournalEntryRequest updateRequest;

    @BeforeEach
    void setUp() {
        testJournalEntry = new JournalEntry();
        testJournalEntry.setId(1L);
        testJournalEntry.setDescription("Test Journal Entry");
        testJournalEntry.setEntryDate(LocalDateTime.now());
        testJournalEntry.setTenantId(1L);
        testJournalEntry.setCreatedBy("testuser");
        testJournalEntry.setStatus(JournalEntry.Status.DRAFT);

        JournalEntryLine debitLine = new JournalEntryLine();
        debitLine.setId(1L);
        debitLine.setAccountCode("1001");
        debitLine.setDescription("Cash Account");
        debitLine.setDebitAmount(BigDecimal.valueOf(1000.00));
        debitLine.setCreditAmount(BigDecimal.ZERO);
        debitLine.setJournalEntry(testJournalEntry);

        JournalEntryLine creditLine = new JournalEntryLine();
        creditLine.setId(2L);
        creditLine.setAccountCode("3001");
        creditLine.setDescription("Revenue Account");
        creditLine.setDebitAmount(BigDecimal.ZERO);
        creditLine.setCreditAmount(BigDecimal.valueOf(1000.00));
        creditLine.setJournalEntry(testJournalEntry);

        testJournalEntry.setLines(Arrays.asList(debitLine, creditLine));

        createRequest = LedgerDto.CreateJournalEntryRequest.builder()
                .description("Test Journal Entry")
                .entryDate(LocalDateTime.now())
                .tenantId(1L)
                .createdBy("testuser")
                .lines(Arrays.asList(
                        LedgerDto.JournalEntryLineRequest.builder()
                                .accountCode("1001")
                                .description("Cash Account")
                                .debitAmount(BigDecimal.valueOf(1000.00))
                                .creditAmount(BigDecimal.ZERO)
                                .build(),
                        LedgerDto.JournalEntryLineRequest.builder()
                                .accountCode("3001")
                                .description("Revenue Account")
                                .debitAmount(BigDecimal.ZERO)
                                .creditAmount(BigDecimal.valueOf(1000.00))
                                .build()
                ))
                .build();

        updateRequest = LedgerDto.UpdateJournalEntryRequest.builder()
                .description("Updated Journal Entry")
                .entryDate(LocalDateTime.now())
                .build();
    }

    @Test
    void createJournalEntry_WithValidData_ShouldReturnCreatedEntry() {
        // Given
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(testJournalEntry);

        // When
        LedgerDto.JournalEntryResponse response = ledgerService.createJournalEntry(createRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDescription()).isEqualTo("Test Journal Entry");
        assertThat(response.getTenantId()).isEqualTo(1L);
        assertThat(response.getCreatedBy()).isEqualTo("testuser");
        assertThat(response.getStatus()).isEqualTo("DRAFT");
        assertThat(response.getLines()).hasSize(2);

        verify(journalEntryRepository).save(any(JournalEntry.class));
        verify(kafkaTemplate).send(eq("ledger-events"), any());
    }

    @Test
    void createJournalEntry_WithUnbalancedEntries_ShouldThrowException() {
        // Given
        LedgerDto.CreateJournalEntryRequest unbalancedRequest = LedgerDto.CreateJournalEntryRequest.builder()
                .description("Unbalanced Entry")
                .entryDate(LocalDateTime.now())
                .tenantId(1L)
                .createdBy("testuser")
                .lines(Arrays.asList(
                        LedgerDto.JournalEntryLineRequest.builder()
                                .accountCode("1001")
                                .description("Cash Account")
                                .debitAmount(BigDecimal.valueOf(1000.00))
                                .creditAmount(BigDecimal.ZERO)
                                .build(),
                        LedgerDto.JournalEntryLineRequest.builder()
                                .accountCode("3001")
                                .description("Revenue Account")
                                .debitAmount(BigDecimal.ZERO)
                                .creditAmount(BigDecimal.valueOf(500.00)) // Unbalanced
                                .build()
                ))
                .build();

        // When & Then
        assertThatThrownBy(() -> ledgerService.createJournalEntry(unbalancedRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Journal entry is not balanced. Total debits: 1000.00, Total credits: 500.00");

        verifyNoInteractions(journalEntryRepository, kafkaTemplate);
    }

    @Test
    void getJournalEntry_WithValidId_ShouldReturnEntry() {
        // Given
        when(journalEntryRepository.findByIdAndTenantId(1L, 1L)).thenReturn(Optional.of(testJournalEntry));

        // When
        LedgerDto.JournalEntryResponse response = ledgerService.getJournalEntry(1L, 1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDescription()).isEqualTo("Test Journal Entry");

        verify(journalEntryRepository).findByIdAndTenantId(1L, 1L);
    }

    @Test
    void getJournalEntry_WithInvalidId_ShouldThrowException() {
        // Given
        when(journalEntryRepository.findByIdAndTenantId(999L, 1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> ledgerService.getJournalEntry(999L, 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Journal entry not found with id: 999");

        verify(journalEntryRepository).findByIdAndTenantId(999L, 1L);
    }

    @Test
    void updateJournalEntry_WithValidData_ShouldReturnUpdatedEntry() {
        // Given
        JournalEntry existingEntry = new JournalEntry();
        existingEntry.setId(1L);
        existingEntry.setDescription("Original Description");
        existingEntry.setStatus(JournalEntry.Status.DRAFT);
        existingEntry.setTenantId(1L);

        when(journalEntryRepository.findByIdAndTenantId(1L, 1L)).thenReturn(Optional.of(existingEntry));
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(existingEntry);

        // When
        LedgerDto.JournalEntryResponse response = ledgerService.updateJournalEntry(1L, 1L, updateRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDescription()).isEqualTo("Updated Journal Entry");

        verify(journalEntryRepository).findByIdAndTenantId(1L, 1L);
        verify(journalEntryRepository).save(any(JournalEntry.class));
        verify(kafkaTemplate).send(eq("ledger-events"), any());
    }

    @Test
    void updateJournalEntry_WithPostedEntry_ShouldThrowException() {
        // Given
        JournalEntry postedEntry = new JournalEntry();
        postedEntry.setId(1L);
        postedEntry.setDescription("Posted Entry");
        postedEntry.setStatus(JournalEntry.Status.POSTED);
        postedEntry.setTenantId(1L);

        when(journalEntryRepository.findByIdAndTenantId(1L, 1L)).thenReturn(Optional.of(postedEntry));

        // When & Then
        assertThatThrownBy(() -> ledgerService.updateJournalEntry(1L, 1L, updateRequest))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Cannot update posted journal entry");

        verify(journalEntryRepository).findByIdAndTenantId(1L, 1L);
        verifyNoMoreInteractions(journalEntryRepository, kafkaTemplate);
    }

    @Test
    void deleteJournalEntry_WithValidDraftEntry_ShouldDeleteEntry() {
        // Given
        when(journalEntryRepository.findByIdAndTenantId(1L, 1L)).thenReturn(Optional.of(testJournalEntry));

        // When
        ledgerService.deleteJournalEntry(1L, 1L);

        // Then
        verify(journalEntryRepository).findByIdAndTenantId(1L, 1L);
        verify(journalEntryRepository).delete(testJournalEntry);
        verify(kafkaTemplate).send(eq("ledger-events"), any());
    }

    @Test
    void deleteJournalEntry_WithPostedEntry_ShouldThrowException() {
        // Given
        testJournalEntry.setStatus(JournalEntry.Status.POSTED);
        when(journalEntryRepository.findByIdAndTenantId(1L, 1L)).thenReturn(Optional.of(testJournalEntry));

        // When & Then
        assertThatThrownBy(() -> ledgerService.deleteJournalEntry(1L, 1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Cannot delete posted journal entry");

        verify(journalEntryRepository).findByIdAndTenantId(1L, 1L);
        verifyNoMoreInteractions(journalEntryRepository, kafkaTemplate);
    }

    @Test
    void postJournalEntry_WithValidDraftEntry_ShouldPostEntry() {
        // Given
        when(journalEntryRepository.findByIdAndTenantId(1L, 1L)).thenReturn(Optional.of(testJournalEntry));
        when(journalEntryRepository.save(any(JournalEntry.class))).thenReturn(testJournalEntry);

        // When
        LedgerDto.JournalEntryResponse response = ledgerService.postJournalEntry(1L, 1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo("POSTED");

        verify(journalEntryRepository).findByIdAndTenantId(1L, 1L);
        verify(journalEntryRepository).save(any(JournalEntry.class));
        verify(kafkaTemplate).send(eq("ledger-events"), any());
    }

    @Test
    void getJournalEntriesByTenant_WithValidTenant_ShouldReturnEntries() {
        // Given
        List<JournalEntry> entries = Arrays.asList(testJournalEntry);
        when(journalEntryRepository.findByTenantIdOrderByEntryDateDesc(1L)).thenReturn(entries);

        // When
        List<LedgerDto.JournalEntryResponse> responses = ledgerService.getJournalEntriesByTenant(1L);

        // Then
        assertThat(responses).isNotNull();
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getId()).isEqualTo(1L);

        verify(journalEntryRepository).findByTenantIdOrderByEntryDateDesc(1L);
    }
}
