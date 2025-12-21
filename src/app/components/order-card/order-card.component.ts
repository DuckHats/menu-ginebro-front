import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuItemComponent } from "../menu-item/menu-item.component";
import { MenuItem } from "../../interfaces/order-history";

@Component({
  selector: "app-order-card",
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: "./order-card.component.html",
  styleUrls: ["./order-card.component.css"],
})
export class OrderCardComponent {
  @Input() date: string = "";
  @Input() tupper?: string;
  @Input() menuItems: MenuItem[] = [];


  get formattedDate(): string {
    const d = new Date(this.date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
