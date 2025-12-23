import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuItem } from "../../interfaces/order-history";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: "app-order-card",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./order-card.component.html",
  styleUrls: ["./order-card.component.css"],
})
export class OrderCardComponent {
  @Input() date: string = "";
  @Input() tupper?: string;
  @Input() menuItems: MenuItem[] = [];
  @Input() menuType: string = "";


  get formattedDate(): string {
    const d = new Date(this.date);
    return d.toLocaleDateString('ca-ES', { day: '2-digit', month: 'long' });
  }

  get formattedYear(): string {
    const d = new Date(this.date);
    return d.getFullYear().toString();
  }
}
