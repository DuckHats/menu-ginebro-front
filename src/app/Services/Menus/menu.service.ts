import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../../config/api.config';
import { ConsoleMessages } from '../../config/console-messages.config';

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  private apiUrl = `${API_CONFIG.baseUrl}/menus`;

  constructor(private http: HttpClient) {}

  getByDate(date: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${date}`)
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

  import(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/import`, body);
  }

  private handleError(error: any) {
    console.error(ConsoleMessages.LOGS.MENUS_SERVICE_ERROR, error);
    return throwError(() => error);
  }
}
