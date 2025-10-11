import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/Auth/auth.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Router } from '@angular/router';
import { NavigationConfig } from '../../environments/navigation.config';
import { IconComponent } from '../../components/icon/icon.component';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { OtpInputComponent } from "../../components/otp-input/otp-input.component";
import { PasswordStrengthComponent } from "../../components/password-strength/password-strength.component";


@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrls: ['./student-registration.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, OtpInputComponent, PasswordStrengthComponent],
})
export class StudentRegistrationComponent {
  step = 1;
  isSubmitting = false;
  passwordValid = false;

  emailForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.ginebroEmailValidator]],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email, this.ginebroEmailValidator]],
      verification_code: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
    });
  }

  sendCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();

      if (this.emailForm.get('email')?.errors?.['ginebroEmail']) {
        this.alertService.show('error', 'El correu ha de ser del domini @ginebro.cat.', '');
      } else {
        this.alertService.show('warning', 'Introdueix un correu vàlid.', '');
      }

      return;
    }

    this.isSubmitting = true;
    this.authService.sendRegisterCode(this.emailForm.value.email).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertService.show('success', 'Codi enviat al teu correu.', '');
        this.registerForm.get('email')?.setValue(this.emailForm.value.email);
        this.step = 2;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.alertService.show('error', 'No s\'ha pogut enviar el codi.', '');
        console.error(err);
      }
    });
  }


  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    if (!this.passwordValid) {
      this.alertService.show('warning', 'La contrasenya no compleix els requisits.', '');
      return;
    }

    if (this.registerForm.invalid) {
      this.alertService.show('warning', 'Tots els camps són obligatoris', '');
      return;
    }

    this.isSubmitting = true;
    const payload = {
      ...this.registerForm.getRawValue(),
      verification_code: +this.registerForm.get('verification_code')?.value // Assegura que sigui número
    };
    this.authService.completeRegister(payload).subscribe({
      next: (response) => {
        if (response.status === 201 || response.status === 200) {
          this.alertService.show('success', 'Registre completat', 'Benvingut!');
          this.router.navigate([NavigationConfig.LOGIN]);
        } else {
          this.alertService.show('error', 'Error de registre', 'Revisa les dades.');
        }
        this.isSubmitting = false;
      },
      error: (err) => {
        this.alertService.show('error', 'Error', 'No s’ha pogut completar el registre.');
        console.error(err);
        this.isSubmitting = false;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate([NavigationConfig.LOGIN]);
  }

  private ginebroEmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    return value.endsWith('@ginebro.cat') ? null : { ginebroEmail: true };
  };

  get passwordValue() {
    return this.registerForm.get('password')?.value;
  }
}