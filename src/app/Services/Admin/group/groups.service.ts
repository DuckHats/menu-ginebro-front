import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../../environments/api.config';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private apiUrl = `${API_CONFIG.baseUrl}/groups`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getOne(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  create(groupData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, groupData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update(id: number, group: { name: string, profile_picture: string, monitor_id: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, group, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  export(format: string): Observable<any> {
    const headers = this.getHeaders();
    const options = {
      headers,
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    };

    return this.http.get(`${this.apiUrl}/export?format=${format}`, options)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  bulkUpload(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bulk`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('GroupService error:', error);
    return throwError(() => error);
  }

}
