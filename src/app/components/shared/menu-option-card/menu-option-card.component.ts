import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOption } from '../../../interfaces/menu';

@Component({
  selector: 'app-menu-option-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-option-card.component.html'
})
export class MenuOptionCardComponent {
  @Input() option!: MenuOption;
  @Input() sectionTitle: string = '';
  @Output() select = new EventEmitter<void>();

  onSelect() {
    this.select.emit();
  }
}
