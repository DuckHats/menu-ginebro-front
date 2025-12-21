import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';
import { SchoolMealInfoComponent } from '../../components/school-meal-info/school-meal-info.component';
import { ActionButtonComponent } from '../../components/action-button/action-button.component';
import { Student } from '../../interfaces/student';
import { Router } from '@angular/router';
import { NavigationConfig } from '../../config/navigation.config';
import { AppConstants } from '../../config/app-constants.config';
import { ConsoleMessages } from '../../config/console-messages.config';

import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { UILabels } from '../../config/ui-labels.config';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [
    CommonModule,
    UserAvatarComponent,
    SchoolMealInfoComponent,
    ActionButtonComponent,
    MatIconModule
  ],
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class WelcomeScreenComponent implements OnInit {
  UILabels = UILabels;
  student!: Student;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedStudent = localStorage.getItem(AppConstants.STORAGE_KEYS.USER);
    if (storedStudent) {
      this.student = JSON.parse(storedStudent);
    } else {
      console.error(ConsoleMessages.ERRORS.STUDENT_NOT_FOUND);
    }
  }

  onSelectMenu(): void {
    this.router.navigate(['/' + NavigationConfig.MENU]);
  }
}
