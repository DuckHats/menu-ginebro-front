import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms'; // <-- import FormsModule here
import { Student } from '../../interfaces/student';
import { Order, MenuItem } from '../../interfaces/order-history';
import { UsersService } from '../../Services/Admin/users/users.service';
import { OrdersService } from '../../Services/Orders/orders.service';
import { MenusService } from '../../Services/Menus/menu.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { UserService } from '../../Services/User/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { BulkUploadModalComponent } from '../../components/bulk-upload-modal/bulk-upload-modal.component';

import { Messages } from '../../config/messages.config';
import { ConfigurationService } from '../../Services/Admin/configuration/configuration.service';
import { SidebarService } from '../../Services/Sidebar/sidebar.service';
import { AppConstants } from '../../config/app-constants.config';
import { ConsoleMessages } from '../../config/console-messages.config';
import { TransactionHistoryComponent } from '../transaction-history/transaction-history.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    DragDropModule,
    TransactionHistoryComponent,
  ],

  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class OrdersDashboardComponent implements OnInit, OnDestroy {
  AppConstants = AppConstants;
  activeTab: string =
    AppConstants.CONFIGURATION.LABELS.ADMIN_DASHBOARD.TABS.ORDERS;
  // Keep this as a Date object so Angular Material datepicker formats correctly
  selectedDate: Date = new Date();
  weeklyMenus: { date: string; menus: MenuItem[] }[] = [];
  selectedExportFormat = 'json';

  // Kitchen View Toggles
  ordersViewMode: 'table' | 'kanban' = 'table';
  kanbanColumns: { status: number; label: string; orders: Order[] }[] = [];
  isSidebarCollapsed = false;

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

  private orderSearch$ = new Subject<string>();
  private userSearch$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private ordersService: OrdersService,
    private menusService: MenusService,
    private alertService: AlertService,
    private userService: UserService,
    private dialog: MatDialog,
    private sidebarService: SidebarService,
    private configService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.admintype = this.userService.getLocalUser()?.user_type_id || 1;
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.loadPaginationSettings();
    this.setupReactiveSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupReactiveSearch(): void {
    this.orderSearch$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.orderPage = 1;
        this.loadOrders(this.formatDate(this.selectedDate));
      });

    this.userSearch$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.userPage = 1;
        this.loadUsers();
      });
  }

  loadPaginationSettings(): void {
    this.configService.getConfigurations().subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          if (res.data.order_per_page) {
            this.orderPerPage = parseInt(res.data.order_per_page);
          }
          if (res.data.user_per_page) {
            this.userPerPage = parseInt(res.data.user_per_page);
          }
        }
        this.loadAllData();
      },
      error: () => {
        this.loadAllData();
      },
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.userPage = 1;
    this.orderPage = 1;
    this.loadAllData();
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  loadAllData(): void {
    if (
      this.activeTab ===
      AppConstants.CONFIGURATION.LABELS.ADMIN_DASHBOARD.TABS.MENUS
    ) {
      this.loadMenusWeek();
    } else if (
      this.activeTab ===
      AppConstants.CONFIGURATION.LABELS.ADMIN_DASHBOARD.TABS.ORDERS
    ) {
      this.loadOrders(this.formatDate(this.selectedDate));
    } else if (
      this.activeTab ===
      AppConstants.CONFIGURATION.LABELS.ADMIN_DASHBOARD.TABS.USERS
    ) {
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
      return this.formatDate(d);
    });

    const menuPromises = datesOfWeek.map((date) =>
      this.menusService
        .getByDate(date)
        .toPromise()
        .then((res: any) => {
          const dishes = res.data?.dishes || [];

          const parsedMenus: MenuItem[] = dishes.map((dish: any) => {
            let parsedOptions: string[] = [];

            try {
              let options = dish.options;
              if (typeof options === 'string') {
                options = JSON.parse(options);
              }
              if (Array.isArray(options)) {
                if (
                  options.length === 1 &&
                  typeof options[0] === 'string' &&
                  options[0].includes(',')
                ) {
                  parsedOptions = options[0]
                    .split(',')
                    .map((o: string) => o.trim())
                    .filter((o: string) => o.length > 0);
                } else {
                  parsedOptions = options;
                }
              }
            } catch (e) {
              console.error(
                ConsoleMessages.ERRORS.PARSING_OPTIONS(dish.id),
                dish.options,
                e
              );
            }

            return {
              type: this.getDishType(dish.dish_type_id),
              name: parsedOptions.join(', ') || 'N/A',
              options: parsedOptions,
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
    const params = {
      page: this.orderPage,
      per_page: this.orderPerPage,
      sort_by: this.orderSortBy,
      sort_order: this.orderSortOrder,
      search: this.orderSearch,
    };

    this.ordersService.getByDate(date, params).subscribe({
      next: (response: any) => {
        const orders = response.data || [];
        this.orders =
          Array.isArray(orders) && Array.isArray(orders[0])
            ? orders.flat()
            : orders;

        if (response.meta) {
          this.orderTotalPages = response.meta.last_page;
          this.orderTotalItems = response.meta.total;
        }

        this.updateKanbanColumns();
        this.loadingOrders = false;
      },
      error: (err) => {
        console.error(ConsoleMessages.ERRORS.FETCHING_ORDERS, err);
        this.loadingOrders = false;
      },
    });
  }

  // Order Pagination & Sorting
  orderPage = 1;
  orderPerPage = 50;
  orderSortBy = 'created_at';
  orderSortOrder = 'desc';
  orderTotalPages = 1;
  orderTotalItems = 0;
  orderSearch = '';

  onOrderSearch(): void {
    this.orderSearch$.next(this.orderSearch);
  }

  changeOrderPage(page: number): void {
    this.orderPage = page;
    this.loadOrders(this.formatDate(this.selectedDate));
  }

  sortOrders(column: string): void {
    if (this.orderSortBy === column) {
      this.orderSortOrder = this.orderSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderSortBy = column;
      this.orderSortOrder = 'asc';
    }
    this.loadOrders(this.formatDate(this.selectedDate));
  }

  getOrderPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.orderTotalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Pagination & Sorting State
  userPage = 1;
  userPerPage = 15;
  userSortBy = 'created_at';
  userSortOrder = 'desc';
  userTotalPages = 1;
  userTotalItems = 0;
  userSearch = '';

  onUserSearch(): void {
    this.userSearch$.next(this.userSearch);
  }

  loadUsers(): void {
    const params = {
      page: this.userPage,
      per_page: this.userPerPage,
      sort_by: this.userSortBy,
      sort_order: this.userSortOrder,
      search: this.userSearch,
    };

    this.usersService.getAll(params).subscribe({
      next: (response: any) => {
        this.students = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          lastName: user.last_name,
          email: user.email,
          status: user.status,
          user_type_id: user.user_type_id,
          balance: user.balance,
        }));

        if (response.meta) {
          this.userTotalPages = response.meta.last_page;
          this.userTotalItems = response.meta.total;
        }
      },
      error: (err) => {
        console.error(ConsoleMessages.ERRORS.LOADING_USERS, err);
      },
    });
  }

  changeUserPage(page: number): void {
    this.userPage = page;
    this.loadUsers();
  }

  sortUsers(column: string): void {
    if (this.userSortBy === column) {
      this.userSortOrder = this.userSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.userSortBy = column;
      this.userSortOrder = 'asc';
    }
    this.loadUsers();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.userTotalPages; i++) {
      pages.push(i);
    }
    return pages;
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

  onDateChange(event: any): void {
    const value = event.value || (event.target as HTMLInputElement).value;
    if (value) {
      // prefer Date object from the picker
      if (value instanceof Date) {
        this.selectedDate = value;
      } else {
        // fallback: try to parse string to Date
        this.selectedDate = new Date(value);
      }
      this.orderPage = 1; // Reset page on date change
      this.loadAllData();
    }
  }

  updateKanbanColumns(): void {
    const statuses = [
      { id: 1, label: 'Pendent' },
      { id: 2, label: 'En preparació' },
      { id: 3, label: 'Entregat' },
      { id: 4, label: 'No recollit' },
    ];

    this.kanbanColumns = statuses.map((s) => ({
      status: s.id,
      label: s.label,
      orders: this.orders.filter((o) => o.order_status_id === s.id),
    }));
  }

  onDrop(event: CdkDragDrop<Order[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const order = event.previousContainer.data[event.previousIndex];
      const newStatusId = Number(event.container.id.replace('status-', ''));

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update backend
      order.order_status_id = newStatusId;
      this.onStatusChange(order);
    }
  }

  onStatusChange(order: Order): void {
    this.ordersService.updateStatus(order.id, order.order_status_id).subscribe({
      next: () => {
        this.alertService.show(
          'success',
          Messages.ORDERS.STATUS_UPDATE_SUCCESS,
          ''
        );
        this.loadOrders(this.formatDate(this.selectedDate));
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
    this.selectedDate = current;
    this.orderPage = 1; // Reset page
    this.loadMenusWeek();
  }

  changeDay(offset: number): void {
    const current = new Date(this.selectedDate);
    current.setDate(current.getDate() + offset);
    this.selectedDate = current;
    this.orderPage = 1; // Reset page
    this.loadOrders(this.formatDate(this.selectedDate));
  }

  // Helper: format a Date into YYYY-MM-DD (API expects this format)
  formatDate(d: Date): string {
    if (!d) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  getRoleName(typeId: number | undefined | null): string {
    const id = typeId || 2;
    return (AppConstants.USER_TYPES as any)[id] || 'Alumne';
  }
}
