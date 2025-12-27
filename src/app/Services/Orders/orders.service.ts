import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = `${API_CONFIG.baseUrl}/orders`;
  private apiUrlByDate = `${API_CONFIG.baseUrl}/orders_by_date`;

  constructor(private http: HttpClient) {}

  getAll(params?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    search?: string;
  }): Observable<any> {
    return this.http
      .get<any>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getByDate(
    date: string,
    params?: {
      page?: number;
      per_page?: number;
      sort_by?: string;
      sort_order?: string;
      search?: string;
    }
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrlByDate}/${date}`, { params })
      .pipe(catchError(this.handleError));
  }

  getByUser(userId: number): Observable<any> {
    return this.http
      .get<any>(`${API_CONFIG.baseUrl}/orders_by_user/${userId}`)
      .pipe(catchError(this.handleError));
  }

  updateStatus(orderId: number, statusId: number): Observable<any> {
    return this.http
      .post(`${API_CONFIG.baseUrl}/orders/updateStatus/${orderId}`, {
        order_status_id: statusId,
      })
      .pipe(catchError(this.handleError));
  }

  createOrder(order: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}`, order)
      .pipe(catchError(this.handleError));
  }

  getOrderTypes(): Observable<any> {
    return this.http
      .get<any>(`${API_CONFIG.baseUrl}/orders_type`)
      .pipe(catchError(this.handleError));
  }

  checkDateAvailability(date: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/checkDate/${date}`)
      .pipe(catchError(this.handleError));
  }

  export(format: string): Observable<any> {
    const options = {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body',
    };

    return this.http
      .get(`${this.apiUrl}/export?format=${format}`, options)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    return throwError(() => error);
  }
}
