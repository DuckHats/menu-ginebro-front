import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/Auth/auth.service';
import { UserService } from '../../Services/User/user.service';
import { ErrorMessages } from '../../config/errors.config';
import { AlertService } from '../../Services/Alert/alert.service';
import { NavigationConfig } from '../../config/navigation.config';
import { IconComponent } from '../../components/icon/icon.component';
import { Messages } from '../../config/messages.config';
// App uses session cookies; token constants removed
import { UILabels } from '../../config/ui-labels.config';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
})
export class LoginComponent {
  loginForm: FormGroup;
  alertMessage: string | null = null;
  isSubmitting = false;
  UILabels = UILabels;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    // No token-based check here: authentication is session/cookie-based, not JWT.
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Backend uses session cookies (no JWT). On success we fetch current user.
          if (response.status === 200) {
            this.userService.me().subscribe({
              next: (fullUser) => {
                this.authService.checkIfAdmin().subscribe(
                  (isAdmin) => {
                    const message = isAdmin
                      ? Messages.AUTH.WELCOME_ADMIN
                      : Messages.AUTH.WELCOME_USER;
                    this.alertService.show(
                      'success',
                      Messages.AUTH.WELCOME,
                      message
                    );
                    if (isAdmin) {
                      this.router.navigateByUrl(NavigationConfig.ADMIN, {
                        replaceUrl: true,
                      });
                      return;
                    }
                    this.router.navigate([NavigationConfig.HOME]);
                  },
                  () => {
                    this.alertService.show(
                      'success',
                      Messages.AUTH.WELCOME,
                      Messages.AUTH.WELCOME_USER
                    );
                    this.router.navigate([NavigationConfig.HOME]);
                  }
                );
              },
              error: (err) => {
                console.error('Error fetching user:', err);
                this.alertService.show(
                  'error',
                  Messages.USERS.LOADING_ERROR,
                  ''
                );
                this.isSubmitting = false;
              },
            });
          } else {
            this.alertService.show('error', ErrorMessages.LOGIN_FAILED, '');
            this.resetForm();
          }
        },
        error: (error) => {
          this.alertService.show(
            'error',
            ErrorMessages.INVALID_CREDENTIALS,
            ''
          );
          console.error(error);
          this.resetForm();
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.alertService.show(
        'warning',
        Messages.VALIDATION.REQUIRED_FIELDS,
        ''
      );
    }
  }

  forgotPassword(): void {
    this.router.navigate([NavigationConfig.FORGOT_PASSWORD]);
  }

  private resetForm(): void {
    this.loginForm.reset();
    this.isSubmitting = false;
  }

  register(): void {
    this.router.navigate([NavigationConfig.REGISTER]);
  }
}
