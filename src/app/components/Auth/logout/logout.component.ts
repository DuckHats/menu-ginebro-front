import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/Auth/auth.service';
import { NavigationConfig } from '../../../config/navigation.config';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private authService: AuthService, private router: Router) {
    // Wait for server-side logout (cookie invalidation) before navigating.
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/' + NavigationConfig.LOGIN]),
      error: () => this.router.navigate(['/' + NavigationConfig.LOGIN]),
    });
  }

}
