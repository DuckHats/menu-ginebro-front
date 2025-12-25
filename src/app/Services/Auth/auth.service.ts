import { Injectable } from '@angular/core';
import { map, Observable, switchMap, catchError } from 'rxjs';
import { BaseService } from '../base.service';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../interfaces/user';
import { AppConstants } from '../../config/app-constants.config';
import { ConsoleMessages } from '../../config/console-messages.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private cachedUser: User | null = null;
  private authExpiryTime: number = 10 * 60 * 1000;
  private cachedTimestamp = 0;


  getCsrfCookie(): Observable<any> {
    return this.http.get('/sanctum/csrf-cookie');
  }

  getGoogleAuthUrl(): string {
    return `${this.baseUrl}/auth/google`;
  }

  login(credentials: { user: string; password: string }): Observable<any> {
    return this.getCsrfCookie().pipe(
      switchMap(() => this.post('login', credentials))
    );
  }

  register(credentials: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.post('register', credentials);
  }

  logout(): Observable<void> {
    return this.getCsrfCookie().pipe(
      switchMap(() => this.post('logout', {})),
      map(() => {
        localStorage.removeItem(AppConstants.STORAGE_KEYS.USER);
        localStorage.removeItem(AppConstants.STORAGE_KEYS.IS_ADMIN);
        this.cachedUser = null;
        this.cachedTimestamp = 0;
        return;
      }),
      catchError((err) => {
        console.error('Logout failed:', err);
        localStorage.removeItem(AppConstants.STORAGE_KEYS.USER);
        localStorage.removeItem(AppConstants.STORAGE_KEYS.IS_ADMIN);
        this.cachedUser = null;
        this.cachedTimestamp = 0;
        // propagate error
        throw err;
      })
    );
  }

  checkAuth(force: boolean = false): Observable<User> {
    const currentTime = new Date().getTime();

    if (
      !force &&
      this.cachedUser &&
      currentTime - this.cachedTimestamp < this.authExpiryTime
    ) {
      return new Observable((observer) => {
        if (this.cachedUser) {
          observer.next(this.cachedUser);
        } else {
          observer.error(ConsoleMessages.ERRORS.NO_CACHED_USER);
        }
      });
    }

    return this.http
      .get<{ status: number; data: User }>(`${this.baseUrl}/users/me`)
      .pipe(
        map((response) => {
          if (response.status === 200) {
            this.cachedUser = response.data;
            this.cachedTimestamp = currentTime;

            localStorage.setItem(
              AppConstants.STORAGE_KEYS.USER,
              JSON.stringify(this.cachedUser)
            );

            return this.cachedUser;
          } else {
            // clear any stale data
            localStorage.removeItem(AppConstants.STORAGE_KEYS.USER);
            this.cachedUser = null;
            this.cachedTimestamp = 0;

            throw new Error(ConsoleMessages.ERRORS.AUTH_FAILED);
          }
        }),
        catchError((err) => {
          // clear storage on error (unauthenticated / server error)
          localStorage.removeItem(AppConstants.STORAGE_KEYS.USER);
          this.cachedUser = null;
          this.cachedTimestamp = 0;
          throw err;
        })
      );
  }

  checkIfAdmin(): Observable<boolean> {
    return this.http
      .get<{ status: number; data: { admin: boolean }; message: string }>(
        `${this.baseUrl}/users/is_admin`
      )
      .pipe(
        map((response) => {
          if (response.status == 200 && response.data.admin == true) {
            localStorage.setItem(AppConstants.STORAGE_KEYS.IS_ADMIN, 'true');

            return true;
          } else {
            localStorage.setItem(AppConstants.STORAGE_KEYS.IS_ADMIN, 'false');

            return false;
          }
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.post('forgot-password', { email });
  }

  sendRegisterCode(email: string): Observable<any> {
    return this.post('register/send-code', { email });
  }

  completeRegister(data: {
    name: string;
    last_name: string;
    email: string;
    verification_code: number;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.post('register/complete', data);
  }

  resetPassword(data: {
    email: string;
    code: number;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.post('reset-password', data);
  }
}
