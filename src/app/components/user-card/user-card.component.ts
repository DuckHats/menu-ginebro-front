import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../Services/User/user.service";
import { User } from "../../interfaces/user";
import { Router } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from "../../Services/Auth/auth.service";
import { AllergyService } from "../../Services/Allergy/allergy.service";
import { AlertService } from "../../Services/Alert/alert.service";
import { Allergy } from "../../interfaces/allergy";
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
  styleUrls: ["./user-card.component.css"],
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, FormsModule, MatSelectModule, MatFormFieldModule],
})
export class UserCardComponent implements OnInit {
  student!: User;
  profileForm: FormGroup;
  allergies: Allergy[] = [];

  avatarSvg: string = `<svg id="33:1977" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="avatar-icon" style="width: 32px; height: 32px">
    <path d="M25.3332 28V25.3333C25.3332 23.9188 24.7713 22.5623 23.7711 21.5621C22.7709 20.5619 21.4143 20 19.9998 20H11.9998C10.5853 20 9.22879 20.5619 8.2286 21.5621C7.22841 22.5623 6.6665 23.9188 6.6665 25.3333V28" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.9998 14.6667C18.9454 14.6667 21.3332 12.2789 21.3332 9.33333C21.3332 6.38781 18.9454 4 15.9998 4C13.0543 4 10.6665 6.38781 10.6665 9.33333C10.6665 12.2789 13.0543 14.6667 15.9998 14.6667Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  constructor(
    private userService: UserService,
    private router : Router,
    private authService: AuthService,
    private allergyService: AllergyService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      allergies: [[]],
      custom_allergies: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllergies();
    this.loadUser();
  }

  loadAllergies() {
    this.allergyService.getAllergies().subscribe({
      next: (data) => {
        this.allergies = data;
      },
      error: (err) => {
        console.error('Error loading allergies', err);
      }
    });
  }

  loadUser() {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      console.error("No user in localStorage.");
      return;
    }

    const parsedUser = JSON.parse(rawUser);
    const userId = parsedUser.id;

    this.userService.getUserById(userId).subscribe({
      next: (data) => {
        this.student = data;
        
        const allergyIds = this.student.allergies ? this.student.allergies.map(a => a.id) : [];
        
        this.profileForm.patchValue({
          allergies: allergyIds,
          custom_allergies: this.student.custom_allergies
        });
      },
      error: (err) => {
        console.error("Failed to fetch student:", err);
      }
    });
  }

  saveAllergies() {
    const formValue = this.profileForm.value;
    const allergiesList = formValue.allergies;
    const customAllergies = formValue.custom_allergies;

    this.allergyService.updateUserAllergies(allergiesList, customAllergies).subscribe({
        next: (res) => {
            this.alertService.show('success', 'Al·lèrgies guardades', 'Les teves al·lèrgies s\'han actualitzat correctament.');
            this.loadUser(); 
        },
        error: (err) => {
            this.alertService.show('error', 'Error', 'No s\'han pogut guardar les al·lèrgies.');
            console.error(err);
        }
    });
  }

  logout() {
    this.router.navigate(['/logout']);
  }

  forgotPassword() {
    this.router.navigate(['/reset-password']);
  }
}
