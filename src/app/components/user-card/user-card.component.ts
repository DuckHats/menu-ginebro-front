import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../Services/User/user.service";
import { User } from "../../interfaces/user";
import { Router } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from "../../Services/Auth/auth.service";
import { AllergyService } from "../../Services/Allergy/allergy.service";
import { Allergy } from "../../interfaces/allergy";
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: "app-user-card",
  templateUrl: "./user-card.component.html",
  styleUrls: ["./user-card.component.css"],
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, FormsModule],
})
export class UserCardComponent implements OnInit {
  student!: User;
  profileForm: FormGroup;
  allergies: Allergy[] = [];
  selectedAllergyIds: Set<number> = new Set();
  successMessage: string = '';
  errorMessage: string = '';

  avatarSvg: string = `<svg id="33:1977" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="avatar-icon" style="width: 32px; height: 32px">
    <path d="M25.3332 28V25.3333C25.3332 23.9188 24.7713 22.5623 23.7711 21.5621C22.7709 20.5619 21.4143 20 19.9998 20H11.9998C10.5853 20 9.22879 20.5619 8.2286 21.5621C7.22841 22.5623 6.6665 23.9188 6.6665 25.3333V28" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.9998 14.6667C18.9454 14.6667 21.3332 12.2789 21.3332 9.33333C21.3332 6.38781 18.9454 4 15.9998 4C13.0543 4 10.6665 6.38781 10.6665 9.33333C10.6665 12.2789 13.0543 14.6667 15.9998 14.6667Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  constructor(
    private userService: UserService,
    private router : Router,
    private authService: AuthService,
    private allergyService: AllergyService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
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
        this.profileForm.patchValue({
          custom_allergies: this.student.custom_allergies
        });
        
        this.selectedAllergyIds.clear();
        if (this.student.allergies) {
           this.student.allergies.forEach(a => this.selectedAllergyIds.add(a.id));
        }
      },
      error: (err) => {
        console.error("Failed to fetch student:", err);
      }
    });
  }

  toggleAllergy(allergyId: number) {
      if (this.selectedAllergyIds.has(allergyId)) {
          this.selectedAllergyIds.delete(allergyId);
      } else {
          this.selectedAllergyIds.add(allergyId);
      }
  }

  saveAllergies() {
    const formValue = this.profileForm.value;
    const payload = {
        custom_allergies: formValue.custom_allergies,
        allergies: Array.from(this.selectedAllergyIds)
    };

    if (this.student) {
        this.userService.updateUser(this.student.id, payload).subscribe({
            next: (res) => {
                this.successMessage = 'Al·lèrgies guardades correctament';
                setTimeout(() => this.successMessage = '', 3000);
                this.loadUser(); 
            },
            error: (err) => {
                this.errorMessage = 'Error guardant les al·lèrgies';
                setTimeout(() => this.errorMessage = '', 3000);
                console.error(err);
            }
        });
    }
  }

  logout() {
    this.router.navigate(['/logout']);
  }

  forgotPassword() {
    this.router.navigate(['/reset-password']);
  }
}
