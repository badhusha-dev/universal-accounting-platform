// Ledger Types
export interface JournalEntry {
  id: string;
  tenantId: string;
  source: string;
  referenceId?: string;
  date: string;
  description: string;
  lines: JournalEntryLine[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface JournalEntryLine {
  id: string;
  journalEntryId: string;
  accountCode: string;
  debit: number;
  credit: number;
  currency: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJournalEntryRequest {
  tenantId: string;
  source: string;
  referenceId?: string;
  date: string;
  description: string;
  lines: {
    accountCode: string;
    debit: number;
    credit: number;
    currency?: string;
    memo?: string;
  }[];
}

export interface CreateJournalEntryResponse {
  journalEntry: JournalEntry;
  message: string;
}

export interface JournalEntryFilters {
  tenantId: string;
  dateFrom?: string;
  dateTo?: string;
  accountCode?: string;
  source?: string;
  referenceId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JournalEntryListResponse {
  journalEntries: JournalEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
  netBalance: number;
}

export interface TrialBalanceResponse {
  date: string;
  items: TrialBalanceItem[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

export interface PnLItem {
  accountCode: string;
  accountName: string;
  amount: number;
  category: string;
}

export interface PnLResponse {
  fromDate: string;
  toDate: string;
  revenue: PnLItem[];
  expenses: PnLItem[];
  netIncome: number;
  grossProfit: number;
}

export interface BalanceSheetItem {
  accountCode: string;
  accountName: string;
  amount: number;
  category: string;
}

export interface BalanceSheetResponse {
  date: string;
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface Account {
  code: string;
  name: string;
  type: string;
  parentCode?: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  tenantId: string;
  journalEntryId?: string;
  reference?: string;
  description: string;
  createdAt: string;
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  dateFrom?: string;
  dateTo?: string;
  filters?: Record<string, any>;
}
