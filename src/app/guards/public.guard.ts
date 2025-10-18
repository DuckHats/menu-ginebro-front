import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/Auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkAuth().pipe(
      map(user => {
        if (user) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }),
      catchError(() => {
        return of(true);
      })
    );
  }
}
