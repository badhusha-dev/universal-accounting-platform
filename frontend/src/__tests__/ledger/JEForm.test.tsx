import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import JEForm from '@/components/ledger/JEForm';

// Mock the API client
vi.mock('@/api/ledger', () => ({
  ledgerApiClient: {
    getAccounts: vi.fn().mockResolvedValue([
      { code: '1000', name: 'Cash', type: 'ASSET' },
      { code: '2000', name: 'Accounts Payable', type: 'LIABILITY' },
    ]),
  },
}));

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

describe('JEForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders journal entry form with required fields', () => {
    render(
      <TestWrapper>
        <JEForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/journal entry lines/i)).toBeInTheDocument();
  });

  it('shows balanced indicator when debits equal credits', async () => {
    render(
      <TestWrapper>
        <JEForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test journal entry' },
    });

    // Fill in first line (debit)
    const debitInputs = screen.getAllByLabelText(/debit/i);
    fireEvent.change(debitInputs[0], { target: { value: '100' } });

    // Fill in second line (credit)
    const creditInputs = screen.getAllByLabelText(/credit/i);
    fireEvent.change(creditInputs[1], { target: { value: '100' } });

    await waitFor(() => {
      expect(screen.getByText(/balanced ✅/i)).toBeInTheDocument();
    });
  });

  it('shows unbalanced indicator when debits do not equal credits', async () => {
    render(
      <TestWrapper>
        <JEForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test journal entry' },
    });

    // Fill in first line (debit)
    const debitInputs = screen.getAllByLabelText(/debit/i);
    fireEvent.change(debitInputs[0], { target: { value: '100' } });

    // Fill in second line (credit) with different amount
    const creditInputs = screen.getAllByLabelText(/credit/i);
    fireEvent.change(creditInputs[1], { target: { value: '50' } });

    await waitFor(() => {
      expect(screen.getByText(/unbalanced/i)).toBeInTheDocument();
    });
  });

  it('prevents submission when form is unbalanced', async () => {
    render(
      <TestWrapper>
        <JEForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test journal entry' },
    });

    // Fill in first line (debit)
    const debitInputs = screen.getAllByLabelText(/debit/i);
    fireEvent.change(debitInputs[0], { target: { value: '100' } });

    // Fill in second line (credit) with different amount
    const creditInputs = screen.getAllByLabelText(/credit/i);
    fireEvent.change(creditInputs[1], { target: { value: '50' } });

    // Try to submit
    fireEvent.click(screen.getByText(/post journal entry/i));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('allows adding new lines', () => {
    render(
      <TestWrapper>
        <JEForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const addButton = screen.getByText(/add line/i);
    fireEvent.click(addButton);

    // Should have 3 lines now (2 initial + 1 added)
    const debitInputs = screen.getAllByDisplayValue('');
    expect(debitInputs.length).toBeGreaterThan(2);
  });

  it('prevents removing lines when only 2 remain', () => {
    render(
      <TestWrapper>
        <JEForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    const removeButtons = screen.getAllByLabelText(/remove line/i);
    expect(removeButtons[0]).toBeDisabled();
    expect(removeButtons[1]).toBeDisabled();
  });

  it('validates required fields', async () => {
    render(
      <TestWrapper>
        <JEForm onSubmit={mockOnSubmit} />
      </TestWrapper>
    );

    // Clear the date field and try to submit
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '' },
    });
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText(/post journal entry/i));

    await waitFor(() => {
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
    });
  });
});
