import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: 'topup' | 'order' | 'correction';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  order_id?: string;
  internal_order_id?: number;
  created_at: string;
  user?: {
    id: number;
    name: string;
    last_name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${API_CONFIG.baseUrl}/transactions`;

  constructor(private http: HttpClient) {}

  /**
   * Get transactions for the current user.
   */
  getTransactions(params?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    search?: string;
  }): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Get all transactions (Admin only).
   */
  getAdminTransactions(params?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    search?: string;
  }): Observable<any> {
    return this.http.get<any>(`${API_CONFIG.baseUrl}/admin/transactions`, {
      params,
    });
  }
}
