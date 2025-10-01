import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/Auth/auth.service';
import { StudentService } from '../../Services/User/user.service';
import { ErrorMessages } from '../../environments/errors.config';
import { AlertService } from '../../Services/Alert/alert.service';
import { NavigationConfig } from '../../environments/navigation.config';
import { IconComponent } from "../../components/icon/icon.component";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconComponent
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  alertMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Already logged in? Redirect
    if (localStorage.getItem('token') !== null) {
      this.router.navigate([NavigationConfig.LOGIN]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.status === 200 && response.data?.token) {
            const token = response.data.token;
            const userId = response.data.user?.id;

            localStorage.setItem('token', token);

            this.studentService.getStudentById(userId).subscribe({
              next: (fullUser) => {
                this.authService.checkIfAdmin().subscribe(
                  (isAdmin) => {
                    const message = isAdmin
                      ? 'Benvingut de nou Admin'
                      : 'Has iniciat sessió correctament.';
                    this.alertService.show('success', 'Benvingut', message);
                    if (isAdmin) {
                      this.router.navigateByUrl(NavigationConfig.ADMIN, { replaceUrl: true });
                      return;
                    }
                    this.router.navigate([NavigationConfig.HOME]);
                  },
                  () => {
                    this.alertService.show('success', 'Benvingut', 'Has iniciat sessió correctament.');
                    this.router.navigate([NavigationConfig.HOME]);
                  }
                );
              },
              error: (err) => {
                console.error('Error fetching user:', err);
                this.alertService.show('error', 'Error carregant l\'usuari complet', '');
                this.isSubmitting = false;
              }
            });
          } else {
            this.alertService.show('error', ErrorMessages.LOGIN_FAILED, '');
            this.resetForm();
          }
        },
        error: (error) => {
          this.alertService.show('error', ErrorMessages.INVALID_CREDENTIALS, '');
          console.error(error);
          this.resetForm();
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });

    } else {
      this.alertService.show('warning', 'Tots els camps són obligatoris', '');
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
