import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { UILabels } from '../../../config/ui-labels.config';

@Component({
  selector: 'app-intro-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './intro-modal.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class IntroModalComponent {
  UILabels = UILabels;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
