import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import {
  CreateJournalEntryRequest,
  CreateJournalEntryResponse,
  JournalEntryFilters,
  JournalEntryListResponse,
  TrialBalanceResponse,
  PnLResponse,
  BalanceSheetResponse,
  Account,
  ActivityEvent,
  ExportOptions
} from '@/types/ledger';

class LedgerApiClient {
  private client = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Request interceptor to add JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        return Promise.reject(error);
      }
    );
  }

  // Journal Entry endpoints
  async createJournalEntry(data: CreateJournalEntryRequest): Promise<CreateJournalEntryResponse> {
    const response: AxiosResponse<CreateJournalEntryResponse> = await this.client.post('/ledger/journal', data);
    return response.data;
  }

  async getJournalEntries(filters: JournalEntryFilters): Promise<JournalEntryListResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response: AxiosResponse<JournalEntryListResponse> = await this.client.get(`/ledger/journal?${params}`);
    return response.data;
  }

  async getJournalEntry(id: string): Promise<any> {
    const response = await this.client.get(`/ledger/journal/${id}`);
    return response.data;
  }

  // Trial Balance endpoints
  async getTrialBalance(tenantId: string, date: string): Promise<TrialBalanceResponse> {
    const response: AxiosResponse<TrialBalanceResponse> = await this.client.get(`/ledger/trial-balance?tenant_id=${tenantId}&date=${date}`);
    return response.data;
  }

  // Reports endpoints
  async getPnL(tenantId: string, fromDate: string, toDate: string, dimension?: string): Promise<PnLResponse> {
    const params = new URLSearchParams({
      tenant_id: tenantId,
      from: fromDate,
      to: toDate,
    });
    if (dimension) {
      params.append('dimension', dimension);
    }

    const response: AxiosResponse<PnLResponse> = await this.client.get(`/reports/pnl?${params}`);
    return response.data;
  }

  async getBalanceSheet(tenantId: string, date: string, dimension?: string): Promise<BalanceSheetResponse> {
    const params = new URLSearchParams({
      tenant_id: tenantId,
      date: date,
    });
    if (dimension) {
      params.append('dimension', dimension);
    }

    const response: AxiosResponse<BalanceSheetResponse> = await this.client.get(`/reports/balance-sheet?${params}`);
    return response.data;
  }

  // Accounts endpoints
  async getAccounts(tenantId: string, query?: string): Promise<Account[]> {
    const params = new URLSearchParams({ tenant_id: tenantId });
    if (query) {
      params.append('query', query);
    }

    const response: AxiosResponse<Account[]> = await this.client.get(`/ledger/accounts?${params}`);
    return response.data;
  }

  // Export endpoints
  async exportJournalEntries(filters: JournalEntryFilters, options: ExportOptions): Promise<Blob> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    params.append('format', options.format);

    const response = await this.client.get(`/ledger/journal/export?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async exportTrialBalance(tenantId: string, date: string, format: string): Promise<Blob> {
    const response = await this.client.get(`/ledger/trial-balance/export?tenant_id=${tenantId}&date=${date}&format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async exportReport(reportType: 'pnl' | 'balance-sheet', tenantId: string, params: Record<string, string>, format: string): Promise<Blob> {
    const queryParams = new URLSearchParams({ tenant_id: tenantId, format, ...params });
    const response = await this.client.get(`/reports/${reportType}/export?${queryParams}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Events/Activity endpoints
  async getActivityEvents(tenantId: string, limit = 50): Promise<ActivityEvent[]> {
    const response: AxiosResponse<ActivityEvent[]> = await this.client.get(`/events/activity?tenant_id=${tenantId}&limit=${limit}`);
    return response.data;
  }

  // Server-Sent Events for real-time updates
  createEventStream(tenantId: string): EventSource {
    const token = localStorage.getItem('token');
    return new EventSource(`/api/events/stream?tenant_id=${tenantId}&token=${token}`);
  }
}

export const ledgerApiClient = new LedgerApiClient();
