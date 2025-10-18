import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/Auth/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NavigationConfig } from '../environments/navigation.config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkAuth().pipe(
      map((user) => {
        if (user) {
          return true;
        } else {
          this.router.navigate(["/" + NavigationConfig.LOGIN]);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error de autenticación:', error);
        this.router.navigate(["/" + NavigationConfig.LOGIN]);
        return [false];
      })
    );
  }
}
