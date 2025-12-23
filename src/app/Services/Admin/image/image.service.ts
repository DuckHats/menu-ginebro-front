import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${API_CONFIG.baseUrl}/images`;

  constructor(private http: HttpClient) { }

  getImages(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  uploadImage(file: File, startDate?: string, endDate?: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    if (startDate) formData.append('start_date', startDate);
    if (endDate) formData.append('end_date', endDate);
    return this.http.post(this.apiUrl, formData);
  }

  updateImageDates(id: number, startDate: string, endDate: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      start_date: startDate,
      end_date: endDate
    });
  }

  deleteImage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  downloadImage(url: string): Observable<Blob> {
    // If the URL is absolute and points to our backend, try to make it relative to use the proxy
    // This assumes the app is running on localhost or the same domain in production
    let targetUrl = url;
    if (url.includes('http://localhost:8001')) {
       targetUrl = url.replace('http://localhost:8001', '');
    }
    
    // We add a cache-busting parameter to avoid stale images
    const timestamp = new Date().getTime();
    const finalUrl = targetUrl.includes('?') ? `${targetUrl}&t=${timestamp}` : `${targetUrl}?t=${timestamp}`;

    return this.http.get(finalUrl, { 
      responseType: 'blob', 
      withCredentials: true,
      headers: {
        'Accept': 'image/jpeg, image/png, image/*',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }
}
