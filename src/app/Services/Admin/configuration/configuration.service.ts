import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = `${API_CONFIG.baseUrl}/configurations`;

  constructor(private http: HttpClient) { }

  getConfigurations(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateConfigurations(settings: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, { settings });
  }
}
