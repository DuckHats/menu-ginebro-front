import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { User } from '../../interfaces/user';
import { API_CONFIG } from '../../environments/api.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private localStorageKey = 'user';
  private baseUrl = `${API_CONFIG.baseUrl}/users`;
  private cachedUser: User | null = null;

  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUsers(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<{ status: number; data: User[] }>(this.baseUrl, { headers });
  }

  getUserById(id: number): Observable<User> {
    if (this.cachedUser && this.cachedUser.id === id) {
      return of(this.cachedUser);
    }

    const headers = this.getHeaders();

    return this.http
      .get<{ status: number; data: User }>(`${this.baseUrl}/${id}`, {
        headers,
      })
      .pipe(
        map((response) => {
          const user = response.data;
          this.saveUser(user);
          return user;
        })
      );
  }

  me(): Observable<User> {
      const headers = this.getHeaders();
      return this.http.get<{data: User}>(`${this.baseUrl}/me`, {headers})
          .pipe(map(res => {
              this.saveUser(res.data);
              return res.data;
          }));
  }

  updateUser(id: number, data: any): Observable<User> {
      const headers = this.getHeaders();
      return this.http.put<{data: User}>(`${this.baseUrl}/${id}`, data, {headers})
          .pipe(map(res => {
              this.saveUser(res.data);
              return res.data;
          }));
  }

  export(format: string): Observable<any> {
    const headers = this.getHeaders();
    const options = {
      headers,
      responseType: 'blob' as 'json',
      observe: 'response' as 'body'
    };

    return this.http.get(`${this.baseUrl}/export?format=${format}`, options)
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
    return this.http.post(`${this.baseUrl}/import`, body, { headers: this.getHeaders() });
  }

  private handleError(error: any) {
    console.error('UserService error:', error);
    return throwError(() => error);
  }
}
