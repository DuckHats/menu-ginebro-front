import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
  private cachedTimestamp: number = 0;

  login(credentials: { user: string; password: string }): Observable<any> {
    return this.post('login', credentials);
  }

  register(credentials: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.post('register', credentials);
  }

  logout(): void {
    localStorage.removeItem(AppConstants.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AppConstants.STORAGE_KEYS.USER);
    localStorage.removeItem(AppConstants.STORAGE_KEYS.IS_ADMIN);
    this.cachedUser = null;
    this.cachedTimestamp = 0;
  }

  checkAuth(): Observable<User> {
    const token = localStorage.getItem(AppConstants.STORAGE_KEYS.TOKEN);
    const currentTime = new Date().getTime();

    if (
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

    if (!token) {
      return new Observable((observer) => {
        observer.error(ConsoleMessages.ERRORS.NO_TOKEN);
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<{ status: number; data: User }>(`${this.baseUrl}/users/me`, {
        headers,
      })
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
            throw new Error(ConsoleMessages.ERRORS.AUTH_FAILED);
          }
        })
      );
  }

  checkIfAdmin(): Observable<boolean> {
    const token = localStorage.getItem(AppConstants.STORAGE_KEYS.TOKEN);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<{ status: number; data: { admin: boolean }; message: string }>(
        `${this.baseUrl}/users/is_admin`,
        { headers }
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
