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

  getAll(params?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
  }): Observable<any> {
    return this.http
      .get<any>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getOne(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(userData: FormData): Observable<any> {
    return this.http
      .post<any>(this.apiUrlregister, userData)
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
      .put<any>(`${this.apiUrl}/${id}`, user)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${id}`)
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

  bulkUpload(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/bulk`, data)
      .pipe(catchError(this.handleError));
  }

  disableUser(id: number): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${id}/disable`, {})
      .pipe(catchError(this.handleError));
  }

  enableUser(id: number): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${id}/enable`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('UsersService error:', error);
    return throwError(() => error);
  }
}
