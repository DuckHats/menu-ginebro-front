import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/Auth/auth.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Router } from '@angular/router';
import { NavigationConfig } from '../../config/navigation.config';
import { IconComponent } from '../../components/icon/icon.component';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorMessages } from '../../config/errors.config';
import { OtpInputComponent } from '../../components/otp-input/otp-input.component';
import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';
import { Messages } from '../../config/messages.config';
import { AppConstants } from '../../config/app-constants.config';
import { UILabels } from '../../config/ui-labels.config';

import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OtpInputComponent,
    PasswordStrengthComponent,
    MatIconModule,
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class StudentRegistrationComponent {
  step = 1;
  isSubmitting = false;
  passwordValid = false;
  UILabels = UILabels;

  emailForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, this.ginebroEmailValidator],
      ],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email, this.ginebroEmailValidator],
      ],
      verification_code: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
  }

  sendCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();

      if (this.emailForm.get('email')?.errors?.['ginebroEmail']) {
        this.alertService.show(
          'error',
          Messages.VALIDATION.GINEBRO_EMAIL_REQUIRED,
          ''
        );
      } else {
        this.alertService.show(
          'warning',
          Messages.VALIDATION.VALID_EMAIL_REQUIRED,
          ''
        );
      }

      return;
    }

    this.isSubmitting = true;
    this.authService.sendRegisterCode(this.emailForm.value.email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.show('success', Messages.REGISTRATION.CODE_SENT, '');
        this.registerForm.get('email')?.setValue(this.emailForm.value.email);
        this.step = 2;
      },
      error: (err) => {
        this.isSubmitting = false;
        let errorMessage = Messages.REGISTRATION.CODE_SEND_ERROR;

        if (
          err.error &&
          err.error.error &&
          err.error.error.code === 'EMAIL_ALREADY_REGISTERED'
        ) {
          errorMessage = ErrorMessages.EMAIL_ALREADY_REGISTERED;
        }

        this.alertService.show('error', errorMessage, '');
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (!this.passwordValid) {
      this.alertService.show(
        'warning',
        Messages.VALIDATION.PASSWORD_REQUIREMENTS,
        ''
      );
      return;
    }

    if (this.registerForm.invalid) {
      this.alertService.show(
        'warning',
        Messages.VALIDATION.REQUIRED_FIELDS,
        ''
      );
      return;
    }

    this.isSubmitting = true;
    const payload = {
      ...this.registerForm.getRawValue(),
      verification_code: +this.registerForm.get('verification_code')?.value, // Assegura que sigui número
    };
    this.authService.completeRegister(payload).subscribe({
      next: (response) => {
        if (response.status === 201 || response.status === 200) {
          this.alertService.show(
            'success',
            Messages.REGISTRATION.REGISTRATION_COMPLETE,
            Messages.REGISTRATION.REGISTRATION_WELCOME
          );
          this.router.navigate([NavigationConfig.LOGIN]);
        } else {
          this.alertService.show(
            'error',
            Messages.REGISTRATION.REGISTRATION_ERROR,
            Messages.REGISTRATION.REGISTRATION_REVIEW
          );
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        let errorMessage = Messages.REGISTRATION.REGISTRATION_FAILED;

        if (err.error && err.error.error) {
          const errorCode = err.error.error.code;
          if (errorCode === 'INVALID_VERIFICATION_CODE') {
            errorMessage = ErrorMessages.INVALID_VERIFICATION_CODE;
          } else if (errorCode === 'USER_ALREADY_EXISTS') {
            errorMessage = ErrorMessages.USER_ALREADY_EXISTS;
          }
        }

        this.alertService.show('error', Messages.GENERIC.ERROR, errorMessage);
        console.error(err);
        this.isSubmitting = false;
      },
    });
  }

  navigateToLogin(): void {
    this.router.navigate([NavigationConfig.LOGIN]);
  }

  private ginebroEmailValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const value = control.value || '';
    return value.endsWith(AppConstants.EMAIL_DOMAINS.GINEBRO)
      ? null
      : { ginebroEmail: true };
  };

  get passwordValue() {
    return this.registerForm.get('password')?.value;
  }
}
