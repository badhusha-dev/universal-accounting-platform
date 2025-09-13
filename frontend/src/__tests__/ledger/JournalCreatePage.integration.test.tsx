import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import JournalCreatePage from '@/pages/ledger/JournalCreatePage';

// Mock the API client
const mockCreateJournalEntry = vi.fn();
vi.mock('@/api/ledger', () => ({
  ledgerApiClient: {
    createJournalEntry: mockCreateJournalEntry,
  },
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('JournalCreatePage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-tenant-id'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('successfully creates and posts a journal entry', async () => {
    const mockResponse = {
      journalEntry: {
        id: 'je-123',
        tenantId: 'mock-tenant-id',
        source: 'manual',
        date: '2024-01-01',
        description: 'Test journal entry',
        lines: [
          { id: '1', accountCode: '1000', debit: 100, credit: 0 },
          { id: '2', accountCode: '2000', debit: 0, credit: 100 },
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        createdBy: 'user-123',
      },
      message: 'Journal entry created successfully',
    };

    mockCreateJournalEntry.mockResolvedValue(mockResponse);

    render(
      <TestWrapper>
        <JournalCreatePage />
      </TestWrapper>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test journal entry' },
    });

    // Fill in account codes
    const accountCodeInputs = screen.getAllByPlaceholderText(/e.g., 1000/i);
    fireEvent.change(accountCodeInputs[0], { target: { value: '1000' } });
    fireEvent.change(accountCodeInputs[1], { target: { value: '2000' } });

    // Fill in debit and credit amounts
    const debitInputs = screen.getAllByLabelText(/debit/i);
    const creditInputs = screen.getAllByLabelText(/credit/i);
    
    fireEvent.change(debitInputs[0], { target: { value: '100' } });
    fireEvent.change(creditInputs[1], { target: { value: '100' } });

    // Wait for balance indicator to show balanced
    await waitFor(() => {
      expect(screen.getByText(/balanced ✅/i)).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByText(/post journal entry/i));

    // Wait for API call
    await waitFor(() => {
      expect(mockCreateJournalEntry).toHaveBeenCalledWith({
        tenantId: 'mock-tenant-id',
        source: 'manual',
        referenceId: undefined,
        date: '2024-01-01',
        description: 'Test journal entry',
        lines: [
          {
            accountCode: '1000',
            debit: 100,
            credit: 0,
            currency: 'USD',
            memo: undefined,
          },
          {
            accountCode: '2000',
            debit: 0,
            credit: 100,
            currency: 'USD',
            memo: undefined,
          },
        ],
      });
    });

    // Should navigate to journal explorer
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ledger/journal-explorer');
    });
  });

  it('handles API errors gracefully', async () => {
    const mockError = new Error('API Error');
    mockCreateJournalEntry.mockRejectedValue(mockError);

    render(
      <TestWrapper>
        <JournalCreatePage />
      </TestWrapper>
    );

    // Fill in a balanced form
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test journal entry' },
    });

    const accountCodeInputs = screen.getAllByPlaceholderText(/e.g., 1000/i);
    fireEvent.change(accountCodeInputs[0], { target: { value: '1000' } });
    fireEvent.change(accountCodeInputs[1], { target: { value: '2000' } });

    const debitInputs = screen.getAllByLabelText(/debit/i);
    const creditInputs = screen.getAllByLabelText(/credit/i);
    
    fireEvent.change(debitInputs[0], { target: { value: '100' } });
    fireEvent.change(creditInputs[1], { target: { value: '100' } });

    await waitFor(() => {
      expect(screen.getByText(/balanced ✅/i)).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByText(/post journal entry/i));

    // Should not navigate on error
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('validates journal entry balance before submission', async () => {
    render(
      <TestWrapper>
        <JournalCreatePage />
      </TestWrapper>
    );

    // Fill in an unbalanced form
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test journal entry' },
    });

    const debitInputs = screen.getAllByLabelText(/debit/i);
    fireEvent.change(debitInputs[0], { target: { value: '100' } });

    // Submit without balancing
    fireEvent.click(screen.getByText(/post journal entry/i));

    // Should not call API
    expect(mockCreateJournalEntry).not.toHaveBeenCalled();
  });
});
