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
    this.authService.logout();

    this.router.navigate(["/" + NavigationConfig.LOGIN]);
  }

}
