import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password = '';
  @Output() strengthChange = new EventEmitter<boolean>();

  strength = {
    level: 0,
    percent: 0,
    label: '',
    hasMinLength: false,
    hasUpper: false,
    hasNumber: false,
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['password']) {
      this.evaluateStrength();
    }
  }

  evaluateStrength() {
    const pass = this.password || '';
    const hasMinLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    let level = 0;

    if (hasMinLength) level++;
    if (hasUpper) level++;
    if (hasNumber) level++;

    this.strength = {
      level,
      percent: (level / 3) * 100,
      label: level === 3 ? 'Forta' : level === 2 ? 'Mitjana' : 'Feble',
      hasMinLength,
      hasUpper,
      hasNumber
    };

    this.strengthChange.emit(level === 3);
  }
}
