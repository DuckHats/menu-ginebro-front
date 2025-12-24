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
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${API_CONFIG.baseUrl}/transactions`;

  constructor(private http: HttpClient) { }

  /**
   * Get transactions for the current user.
   */
  getTransactions(): Observable<{ status: string; data: Transaction[] }> {
    return this.http.get<{ status: string; data: Transaction[] }>(this.apiUrl);
  }

  /**
   * Get all transactions (Admin only).
   */
  getAdminTransactions(): Observable<{ status: string; data: Transaction[] }> {
    return this.http.get<{ status: string; data: Transaction[] }>(`${API_CONFIG.baseUrl}/admin/transactions`);
  }
}
