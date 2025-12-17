import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/User/user.service';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../Services/Auth/auth.service';
import { AllergyService } from '../../Services/Allergy/allergy.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Allergy } from '../../interfaces/allergy';
import { forkJoin } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Messages } from '../../config/messages.config';
import { AppConstants } from '../../config/app-constants.config';
import { AssetsConfig } from '../../config/assets.config';

import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class UserCardComponent implements OnInit {
  student!: User;
  profileForm: FormGroup;
  allergies: Allergy[] = [];

  avatarSvg: string = AssetsConfig.SVG.USER_AVATAR;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private allergyService: AllergyService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      allergies: [[]],
      custom_allergies: [''],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const rawUser = localStorage.getItem(AppConstants.STORAGE_KEYS.USER);
    if (!rawUser) {
      console.error('No user in localStorage.');
      return;
    }

    const parsedUser = JSON.parse(rawUser);
    const userId = parsedUser.id;

    forkJoin({
      allergies: this.allergyService.getAllergies(),
      user: this.userService.getUserById(userId),
    }).subscribe({
      next: (result) => {
        this.allergies = result.allergies;
        this.student = result.user;

        const allergyIds = this.student.allergies
          ? this.student.allergies.map((a) => a.id)
          : [];

        this.profileForm.patchValue({
          allergies: allergyIds,
          custom_allergies: this.student.custom_allergies,
        });
      },
      error: (err) => {
        console.error('Error loading profile data', err);
      },
    });
  }

  saveAllergies() {
    const formValue = this.profileForm.value;
    const allergiesList = formValue.allergies;
    const customAllergies = formValue.custom_allergies;

    this.allergyService
      .updateUserAllergies(allergiesList, customAllergies)
      .subscribe({
        next: (res) => {
          this.alertService.show(
            'success',
            Messages.USERS.ALLERGIES_SAVED,
            Messages.USERS.ALLERGIES_SAVED_DESC
          );
          this.loadData();
        },
        error: (err) => {
          this.alertService.show(
            'error',
            Messages.GENERIC.ERROR,
            Messages.USERS.ALLERGIES_ERROR
          );
          console.error(err);
        },
      });
  }

  logout() {
    this.router.navigate(['/logout']);
  }

  forgotPassword() {
    this.router.navigate(['/reset-password']);
  }
}
