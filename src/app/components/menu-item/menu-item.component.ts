import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
})
export class MenuItemComponent {
  @Input() type: string = '';
  @Input() name: string = '';
}
