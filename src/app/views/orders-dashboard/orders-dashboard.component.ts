import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- import FormsModule here
import { Student } from '../../interfaces/student';
import { Order, MenuItem } from '../../interfaces/order-history';
import { UsersService } from '../../Services/Admin/users/users.service';
import { OrdersService } from '../../Services/Orders/orders.service';
import { MenusService } from '../../Services/Menus/menu.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { UserService } from '../../Services/User/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BulkUploadModalComponent } from '../../components/bulk-upload-modal/bulk-upload-modal.component';
import { Messages } from '../../config/messages.config';
import { AppConstants } from '../../config/app-constants.config';
import { ConsoleMessages } from '../../config/console-messages.config';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
})
export class OrdersDashboardComponent implements OnInit {
  activeTab = 'ordres';
  selectedDate = new Date().toISOString().split('T')[0];
  weeklyMenus: { date: string; menus: MenuItem[] }[] = [];
  selectedExportFormat = 'json';

  students: Student[] = [];
  orders: Order[] = [];
  menus: MenuItem[] = [];
  admintype: number = 1;
  loadingOrders = true;

  // Bulk popup
  showImportPopup = false;
  importType: 'menus' | 'usuaris' = 'menus';
  selectedFile: File | null = null;

  // Status options for the select dropdown
  statusOptions = AppConstants.ORDER_STATUS_OPTIONS;

  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
    private menusService: MenusService,
    private alertService: AlertService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.admintype = this.userService.getLocalUser()?.user_type_id || 1;
    this.loadAllData();
  }

  setActiveTab(tab: 'ordres' | 'menus' | 'usuaris' | 'json' | 'export'): void {
    this.activeTab = tab;
    this.loadAllData();
  }

  loadAllData(): void {
    if (this.activeTab === 'menus') {
      this.loadMenusWeek();
    } else if (this.activeTab === 'ordres') {
      this.loadOrders(this.selectedDate);
    } else if (this.activeTab === 'usuaris') {
      this.loadUsers();
    }
  }

  loadMenusWeek(): void {
    const today = new Date(this.selectedDate);
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(today.getDate() + diffToMonday);

    const datesOfWeek = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    const menuPromises = datesOfWeek.map((date) =>
      this.menusService
        .getByDate(date)
        .toPromise()
        .then((res: any) => {
          const dishes = res.data?.dishes || [];

          const parsedMenus: MenuItem[] = dishes.map((dish: any) => {
            let name = 'N/A';

            try {
              let options = dish.options;
              if (typeof options === 'string') {
                options = JSON.parse(options);
              }
              name =
                Array.isArray(options) && options.length > 0
                  ? options[0]
                  : 'N/A';
            } catch (e) {
              console.error(
                ConsoleMessages.ERRORS.PARSING_OPTIONS(dish.id),
                dish.options,
                e
              );
            }

            return {
              type: this.getDishType(dish.dish_type_id),
              name,
              date,
            };
          });

          return { date, menus: parsedMenus };
        })
        .catch((err) => {
          if (err.status === 404) {
            console.error(ConsoleMessages.ERRORS.NO_MENU_FOR_DATE(date));
          } else {
            console.error(
              ConsoleMessages.ERRORS.FETCHING_MENU_FOR_DATE(date),
              err
            );
          }
          return { date, menus: [] };
        })
    );

    Promise.all(menuPromises).then((results) => {
      this.weeklyMenus = results;
    });
  }

  getDishType(id: number): string {
    return (
      AppConstants.DISH_TYPES[id as keyof typeof AppConstants.DISH_TYPES] ||
      'Altre'
    );
  }

  loadOrders(date: string): void {
    this.loadingOrders = true;
    this.ordersService.getByDate(date).subscribe({
      next: (response: any) => {
        let orders = response.data || [];
        if (Array.isArray(orders) && Array.isArray(orders[0])) {
          orders = orders.flat();
        }
        this.orders = orders;
        this.loadingOrders = false;
      },
      error: (err) => {
        console.error(ConsoleMessages.ERRORS.FETCHING_ORDERS, err);
        this.loadingOrders = false;
      },
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: any) => {
        this.students = users.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          lastName: user.last_name,
          email: user.email,
          status: user.status,
          user_type_id: user.user_type_id,
        }));
      },
      error: (err) => {
        console.error(ConsoleMessages.ERRORS.LOADING_USERS, err);
      },
    });
  }

  exportOrdersData(): void {
    this.ordersService.export(this.selectedExportFormat).subscribe({
      next: (response) => {
        const blob = new Blob([response.body], { type: response.body.type });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `orders.${this.selectedExportFormat}`;
        a.click();
        window.URL.revokeObjectURL(a.href);
      },
      error: (err) => {
        this.alertService.show(
          'error',
          Messages.IMPORT_EXPORT.EXPORT_ERROR,
          '',
          3000
        );
      },
    });
  }

  exportMenuData(): void {
    this.menusService.export(this.selectedExportFormat).subscribe({
      next: (response) => {
        const blob = new Blob([response.body], { type: response.body.type });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `menus.${this.selectedExportFormat}`;
        a.click();
        window.URL.revokeObjectURL(a.href);
      },
      error: (err) => {
        this.alertService.show(
          'error',
          Messages.IMPORT_EXPORT.EXPORT_ERROR,
          '',
          3000
        );
      },
    });
  }

  exportUserData(): void {
    this.userService.export(this.selectedExportFormat).subscribe({
      next: (response) => {
        const blob = new Blob([response.body], { type: response.body.type });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `users.${this.selectedExportFormat}`;
        a.click();
        window.URL.revokeObjectURL(a.href);
      },
      error: (err) => {
        this.alertService.show(
          'error',
          Messages.IMPORT_EXPORT.EXPORT_ERROR,
          '',
          3000
        );
      },
    });
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.selectedDate = input.value;
      this.loadAllData();
    }
  }

  onStatusChange(order: Order): void {
    this.ordersService.updateStatus(order.id, order.orderStatus.id).subscribe({
      next: () => {
        this.alertService.show(
          'success',
          Messages.ORDERS.STATUS_UPDATE_SUCCESS,
          ''
        );
        this.loadOrders(this.selectedDate);
      },
      error: (err) => {
        this.alertService.show(
          'error',
          Messages.ORDERS.STATUS_UPDATE_ERROR,
          ''
        );
      },
    });
  }

  changeWeek(offset: number): void {
    const current = new Date(this.selectedDate);
    current.setDate(current.getDate() + offset * 7);
    this.selectedDate = current.toISOString().split('T')[0];
    this.loadMenusWeek();
  }

  changeDay(offset: number): void {
    const current = new Date(this.selectedDate);
    current.setDate(current.getDate() + offset);
    this.selectedDate = current.toISOString().split('T')[0];
    this.loadOrders(this.selectedDate);
  }

  toggleUserStatus(student: Student): void {
    if (this.isProtectedUser(student)) {
      this.alertService.show('error', Messages.USERS.PROTECTED_USER_ERROR, '');
      return;
    }

    const isActive = student.status === 1;
    const request$ = isActive
      ? this.usersService.disableUser(student.id)
      : this.usersService.enableUser(student.id);

    request$.subscribe({
      next: () => {
        student.status = isActive ? 0 : 1;
        this.alertService.show(
          'success',
          Messages.USERS.STATUS_CHANGE_SUCCESS(isActive),
          ''
        );
      },
      error: (err) => {
        this.alertService.show('error', Messages.USERS.STATUS_CHANGE_ERROR, '');
      },
    });
  }

  openImportPopup(type: 'menus' | 'usuaris'): void {
    this.importType = type;
    const dialogRef = this.dialog.open(BulkUploadModalComponent, {
      width: '500px',
      data: {
        plantillaUrl:
          type === 'menus'
            ? AppConstants.IMPORT_TEMPLATES.MENUS
            : AppConstants.IMPORT_TEMPLATES.USERS,
        descripcion:
          type === 'menus'
            ? AppConstants.IMPORT_DESCRIPTIONS.MENUS
            : AppConstants.IMPORT_DESCRIPTIONS.USERS,
        plantillaCsvUrl:
          type === 'menus'
            ? AppConstants.IMPORT_TEMPLATES.MENUS_CSV
            : undefined,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (type === 'menus') {
          this.menusService.import(result).subscribe({
            next: () => {
              this.alertService.show(
                'success',
                Messages.IMPORT_EXPORT.MENUS_IMPORT_SUCCESS,
                '',
                3000
              );
              this.loadMenusWeek();
            },
            error: (error: Error) => {
              this.alertService.show(
                'error',
                Messages.IMPORT_EXPORT.MENUS_IMPORT_ERROR,
                '',
                3000
              );
            },
          });
        } else {
          this.userService.import(result).subscribe({
            next: () => {
              this.alertService.show(
                'success',
                Messages.IMPORT_EXPORT.USERS_IMPORT_SUCCESS,
                '',
                3000
              );
              this.loadUsers();
            },
            error: (error: Error) => {
              this.alertService.show(
                'error',
                Messages.IMPORT_EXPORT.USERS_IMPORT_ERROR,
                '',
                3000
              );
            },
          });
        }
      }
    });
  }

  importData(json: any): void {
    if (!json) return;
    if (this.importType === 'menus') {
      this.menusService.import(json).subscribe({
        next: () => {
          this.alertService.show(
            'success',
            Messages.IMPORT_EXPORT.MENUS_IMPORT_SUCCESS,
            '',
            3000
          );
          this.loadMenusWeek();
        },
        error: (error: Error) => {
          this.alertService.show(
            'error',
            Messages.IMPORT_EXPORT.MENUS_IMPORT_ERROR,
            '',
            3000
          );
        },
      });
    } else {
      this.userService.import(json).subscribe({
        next: () => {
          this.alertService.show(
            'success',
            Messages.IMPORT_EXPORT.USERS_IMPORT_SUCCESS,
            '',
            3000
          );
          this.loadUsers();
        },
        error: (error: Error) => {
          this.alertService.show(
            'error',
            Messages.IMPORT_EXPORT.USERS_IMPORT_ERROR,
            '',
            3000
          );
        },
      });
    }
    this.showImportPopup = false; // Cierra el popup si usas el modal antiguo
  }

  isProtectedUser(student: Student): boolean {
    const currentUserId = this.userService.getUserId();
    const nameLower = student.name.toLowerCase();

    // 1. Current user
    if (student.id === currentUserId) return true;

    // 2. Admin or Cooker
    if (student.user_type_id == 1 || student.user_type_id == 3) return true;

    return false;
  }
}
