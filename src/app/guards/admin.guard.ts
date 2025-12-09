import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/Auth/auth.service';
import { NavigationConfig } from '../config/navigation.config';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable((observer) => {
      this.authService.checkIfAdmin().subscribe(
        (isAdmin) => {
          if (isAdmin) {
            observer.next(true);
          } else {
            this.router.navigate(['/']);
            observer.next(false);
          }
        },
        (error) => {
          this.router.navigate(['/' + NavigationConfig.LOGIN]);
          observer.next(false);
        }
      );
    });
  }
}
