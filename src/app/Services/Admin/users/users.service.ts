import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public apiUrl = `${API_CONFIG.baseUrl}/users`;
  private apiUrlregister = `${API_CONFIG.baseUrl}/register`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getOne(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(userData: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrlregister, userData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update(
    id: number,
    user: {
      username: string;
      email: string;
      password: string;
      password_confirmation: string;
      phone: number;
    }
  ): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, user, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  export(format: string): Observable<any> {
    const headers = this.getHeaders();
    const options = {
      headers,
      responseType: 'blob' as 'json',
      observe: 'response' as 'body',
    };

    return this.http
      .get(`${this.apiUrl}/export?format=${format}`, options)
      .pipe(catchError(this.handleError));
  }

  bulkUpload(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/bulk`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  toggleUser(endpoint: string): Observable<any> {
    return this.http
      .post(endpoint, {}, { headers: this.getHeaders() })
      .pipe(catchError((err) => throwError(() => err)));
  }

  enableUser(id: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/${id}/enable`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  disableUser(id: number): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}/${id}/disable`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('ActivitiesService error:', error);
    return throwError(() => error);
  }
}
