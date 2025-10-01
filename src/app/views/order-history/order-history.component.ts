import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { Order, MenuItem } from '../../interfaces/order-history';
import { OrdersService } from '../../Services/Orders/orders.service';
import { Router } from '@angular/router';
import { StudentService } from '../../Services/User/user.service';
import { NavigationConfig } from '../../environments/navigation.config';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  clockIcon = `<svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[20px] h-[24px]">
    <path d="M10.2084 22C14.9066 22 18.7153 17.5228 18.7153 12C18.7153 6.47715 14.9066 2 10.2084 2C5.5101 2 1.70142 6.47715 1.70142 12C1.70142 17.5228 5.5101 22 10.2084 22Z" stroke="#009CA6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10.2083 6V12L13.611 14" stroke="#009CA6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;

  orders: Order[] = [];
  userId: number = 1;

  constructor(private ordersService: OrdersService,
    private router: Router,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.userId = this.studentService.getLocalStudent()?.id || 1;
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getByUser(this.userId).subscribe({
      next: (response) => {
        console.log('Orders loaded:', response);
        this.orders = (response.data || []).map((order: Order) => {
          const menuItems: MenuItem[] = [];
          const type = order.orderType?.name?.toLowerCase() || '';

          if (order.orderDetail) {
            if (type.includes('primer')) {
              menuItems.push({ type: 'Primer Plat', name: order.orderDetail.option1 });
            }
            if (type.includes('segon') || type.includes('segundo')) {
              menuItems.push({ type: 'Segon Plat', name: order.orderDetail.option2 });
            }
            if (type.includes('postre')) {
              menuItems.push({ type: 'Postre', name: order.orderDetail.option3 });
            }
          }

          return {
            ...order,
            menuItems,
            tupper: order.has_tupper === 1 ? 'Ha portat tàper' : undefined,
          };
        });
      },
      error: (err) => {
        console.error('Error loading order history:', err);
      },
    });
  }

  goToHomePage(): void {
    this.router.navigate(["/" + NavigationConfig.HOME]);
  }
}