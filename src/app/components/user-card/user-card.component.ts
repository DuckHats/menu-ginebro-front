import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../Services/User/user.service';
import { Student } from '../../interfaces/student';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../Services/Auth/auth.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class UserCardComponent implements OnInit {
  student!: Student;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      return;
    }

    const parsedUser = JSON.parse(rawUser);
    const userId = parsedUser.id;

    this.studentService.getStudentById(userId).subscribe({
      next: (data) => {
        this.student = data;
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
