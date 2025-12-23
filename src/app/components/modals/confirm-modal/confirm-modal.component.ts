import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { UILabels } from '../../../config/ui-labels.config';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './confirm-modal.component.html',
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
export class ConfirmModalComponent {
  UILabels = UILabels;

  @Input() selectedDate!: Date;
  @Input() menuTypeName: string = '';
  @Input() selectedOptions: string[] = [];
  @Input() taperSelected: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
