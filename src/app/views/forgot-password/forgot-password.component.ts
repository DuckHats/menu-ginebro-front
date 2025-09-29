import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../Services/Alert/alert.service';
import { NavigationConfig } from '../../environments/navigation.config';
import { OtpInputComponent } from '../../components/otp-input/otp-input.component';
import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OtpInputComponent,
    PasswordStrengthComponent
  ]
})
export class ForgotPasswordComponent {
  step = 1;
  emailForm: FormGroup;
  resetForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  sendResetCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      this.alertService.show('warning', 'El correu electrònic no és vàlid.', '', 3000);
      return;
    }

    this.isSubmitting = true;

    this.authService.forgotPassword(this.emailForm.value.email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.show('info', 'Codi enviat al teu correu electrònic', '', 3000);
        this.resetForm.patchValue({ email: this.emailForm.value.email });
        this.step = 2;
      },
      error: () => {
        this.isSubmitting = false;
        this.alertService.show('error', 'Error enviant el codi. Si us plau, torna-ho a intentar.', '', 3000);
      }
    });
  }

  resetPassword(): void {
    this.resetForm.updateValueAndValidity();

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();

      const errors = this.resetForm.errors;
      if (errors?.['passwordsMismatch']) {
        this.alertService.show('warning', 'Les contrasenyes no coincideixen.', '', 3000);
      } else {
        this.alertService.show('warning', 'Revisa tots els camps del formulari.', '', 3000);
      }

      return;
    }

    this.isSubmitting = true;

    this.authService.resetPassword(this.resetForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.show('success', 'Contrasenya restablerta correctament', '', 3000);
        this.router.navigateByUrl(NavigationConfig.LOGOUT);
      },
      error: () => {
        this.isSubmitting = false;
        this.alertService.show('error', 'Error al restablir la contrasenya. Si us plau, torna-ho a intentar més tard.', '', 3000);
      }
    });
  }

  passwordsMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }
}
