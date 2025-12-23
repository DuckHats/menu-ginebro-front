import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/Auth/auth.service';
import { ConfigurationService } from '../Services/Admin/configuration/configuration.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { NavigationConfig } from '../config/navigation.config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private configService: ConfigurationService
  ) {}

  canActivate(route: any, state: any): Observable<boolean> {
    return this.authService.checkAuth().pipe(
      switchMap((user) => {
        if (!user) {
          this.router.navigate(['/' + NavigationConfig.LOGIN]);
          return of(false);
        }

        // Allow logout route regardless of maintenance mode
        if (state.url.includes(NavigationConfig.LOGOUT)) {
          return of(true);
        }

        // If user is admin, allow access regardless of maintenance mode
        if (user.user_type_id === 1) {
          return of(true);
        }

        // Check maintenance mode for non-admin users
        return this.configService.getConfigurations().pipe(
          map((res) => {
            if (res.status === 'success' && res.data.app_active === '0') {
              this.router.navigate(['/' + NavigationConfig.MAINTENANCE]);
              return false;
            }
            return true;
          }),
          catchError(() => of(true)) // If config fails, allow access to not block users
        );
      }),
      catchError((error) => {
        console.error('Error de autenticación:', error);
        this.router.navigate(['/' + NavigationConfig.LOGIN]);
        return of(false);
      })
    );
  }
}
