import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { User } from '../../interfaces/user';
import { API_CONFIG } from '../../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localStorageKey = 'user';
  private baseUrl = `${API_CONFIG.baseUrl}/users`;
  private cachedUser: User | null = null;

  constructor(private http: HttpClient) {}

  getCsrfCookie(): Observable<any> {
    return this.http.get('/sanctum/csrf-cookie');
  }

  getUsers(params?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: string;
    search?: string;
  }): Observable<any> {
    return this.http.get<any>(this.baseUrl, { params });
  }

  getUserById(id: number): Observable<User> {
    // Cache check removed to ensure fresh data (including allergies) is always fetched

    return this.http
      .get<{ status: number; data: User }>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response) => {
          const user = response.data;
          this.saveUser(user);
          return user;
        })
      );
  }

  me(): Observable<User> {
    return this.http.get<{ data: User }>(`${this.baseUrl}/me`).pipe(
      map((res) => {
        this.saveUser(res.data);
        return res.data;
      })
    );
  }

  updateUser(id: number, data: any): Observable<User> {
    return this.http.put<{ data: User }>(`${this.baseUrl}/${id}`, data).pipe(
      map((res) => {
        this.saveUser(res.data);
        return res.data;
      })
    );
  }

  export(format: string): Observable<any> {
    const options = {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body',
    };

    return this.http
      .get(`${this.baseUrl}/export?format=${format}`, options)
      .pipe(catchError(this.handleError));
  }

  getLocalUser(): User | null {
    if (this.cachedUser) return this.cachedUser;

    const userJson = localStorage.getItem(this.localStorageKey);
    if (userJson) {
      try {
        const parsed = JSON.parse(userJson);
        this.cachedUser = parsed;
        return parsed;
      } catch {
        return null;
      }
    }

    return null;
  }

  saveUser(user: User): void {
    this.cachedUser = user;
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }

  clearUser(): void {
    this.cachedUser = null;
    localStorage.removeItem(this.localStorageKey);
  }

  isLoggedIn(): boolean {
    return !!this.getLocalUser();
  }

  getUserId(): number | null {
    return this.getLocalUser()?.id ?? null;
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  import(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/import`, body);
  }

  private handleError(error: any) {
    console.error('UserService error:', error);
    return throwError(() => error);
  }
}
