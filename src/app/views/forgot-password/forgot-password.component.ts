import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../Services/Alert/alert.service';
import { NavigationConfig } from '../../config/navigation.config';
import { OtpInputComponent } from '../../components/otp-input/otp-input.component';
import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';
import { Messages } from '../../config/messages.config';
import { UILabels } from '../../config/ui-labels.config';

import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OtpInputComponent,
    PasswordStrengthComponent,
    MatIconModule
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ForgotPasswordComponent {
  step = 1;
  emailForm: FormGroup;
  resetForm: FormGroup;
  isSubmitting = false;
  passwordValid = false;
  UILabels = UILabels;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        code: ['', [Validators.required, Validators.minLength(4)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  navigateToLogin(): void {
    this.router.navigate([NavigationConfig.LOGIN]);
  }

  sendResetCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      this.alertService.show(
        'warning',
        Messages.VALIDATION.INVALID_EMAIL,
        '',
        3000
      );
      return;
    }

    this.isSubmitting = true;

    this.authService.forgotPassword(this.emailForm.value.email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.show(
          'info',
          Messages.PASSWORD_RESET.CODE_SENT,
          '',
          3000
        );
        this.resetForm.patchValue({ email: this.emailForm.value.email });
        this.step = 2;
      },
      error: () => {
        this.isSubmitting = false;
        this.alertService.show(
          'error',
          Messages.PASSWORD_RESET.CODE_SEND_ERROR,
          '',
          3000
        );
      },
    });
  }

  resetPassword(): void {
    this.resetForm.updateValueAndValidity();
    this.resetForm.markAllAsTouched();

    if (!this.passwordValid) {
      this.alertService.show(
        'warning',
        Messages.VALIDATION.PASSWORD_REQUIREMENTS,
        '',
        3000
      );
      return;
    }

    if (this.resetForm.invalid) {
      const errors = this.resetForm.errors;
      if (errors?.['passwordsMismatch']) {
        this.alertService.show(
          'warning',
          Messages.VALIDATION.PASSWORDS_MISMATCH,
          '',
          3000
        );
      } else {
        this.alertService.show(
          'warning',
          Messages.VALIDATION.REVIEW_FORM_FIELDS,
          '',
          3000
        );
      }
      return;
    }
    this.isSubmitting = true;

    this.authService.resetPassword(this.resetForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.show(
          'success',
          Messages.PASSWORD_RESET.RESET_SUCCESS,
          '',
          3000
        );
        this.router.navigateByUrl(NavigationConfig.LOGOUT);
      },
      error: () => {
        this.isSubmitting = false;
        this.alertService.show(
          'error',
          Messages.PASSWORD_RESET.RESET_ERROR,
          '',
          3000
        );
      },
    });
  }

  passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }
}
