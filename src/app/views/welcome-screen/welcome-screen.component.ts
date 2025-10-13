import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';
import { SchoolMealInfoComponent } from '../../components/school-meal-info/school-meal-info.component';
import { ActionButtonComponent } from '../../components/action-button/action-button.component';
import { Student } from '../../interfaces/student';
import { Router } from '@angular/router';
import { NavigationConfig } from '../../environments/navigation.config';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [
    CommonModule,
    UserAvatarComponent,
    SchoolMealInfoComponent,
    ActionButtonComponent,
  ],
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css'],
})
export class WelcomeScreenComponent implements OnInit {
  student!: Student;

  constructor(private router: Router) { }

  ngOnInit() {
    const storedStudent = localStorage.getItem('user');
    if (storedStudent) {
      this.student = JSON.parse(storedStudent);
    } else {
      console.error('Student not found in localStorage');
    }
  }

  onSelectMenu(): void {
    this.router.navigate(["/" + NavigationConfig.HOME]);
  }
}
