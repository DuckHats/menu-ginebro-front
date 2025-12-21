import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MenuOption, MenuSection } from '../../interfaces/menu';
import { WeeklyCalendarComponent } from '../../components/weekly-calendar/weekly-calendar.component';
import { API_CONFIG } from '../../config/api.config';
import { OrdersService } from '../../Services/Orders/orders.service';
import { MenusService } from '../../Services/Menus/menu.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Router } from '@angular/router';
import { Messages } from '../../config/messages.config';
import { AppConstants } from '../../config/app-constants.config';
import { ConsoleMessages } from '../../config/console-messages.config';

import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { UILabels } from '../../config/ui-labels.config';

@Component({
  selector: 'app-menu-selection',
  templateUrl: './menu-selection.component.html',
  styleUrls: ['./menu-selection.component.css'],
  standalone: true,
  imports: [CommonModule, WeeklyCalendarComponent, MatIconModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export default class MenuSelectionComponent implements OnInit {
  UILabels = UILabels;
  orderTypes: { id: number; name: string }[] = [];
  menuTypes: { id: number; name: string; selected: boolean }[] = [];
  menuSections: MenuSection[] = [];
  taperSelected = false;
  selectedDate: Date = new Date();

  constructor(
    private http: HttpClient,
    private ordersService: OrdersService,
    private alertService: AlertService,
    private route: Router,
    private menusService: MenusService
  ) {}

  ngOnInit(): void {
    this.loadOrderTypes();
    this.loadMenuFromBackend();
  }

  loadOrderTypes(): void {
    this.ordersService.getOrderTypes().subscribe({
      next: (response) => {
        const types = response.data || response;
        this.orderTypes = types;
        this.menuTypes = types.map((type: any) => ({
          id: type.id,
          name: type.name,
          selected: false,
        }));
      },
      error: (err) => {
        console.error(ConsoleMessages.ERRORS.LOADING_ORDER_TYPES, err);
        this.orderTypes = [];
        this.menuTypes = [];
      },
    });
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.loadMenuFromBackend();
  }

  loadMenuFromBackend(): void {
    if (!this.selectedDate) return;

    const formattedDate = this.formatDate(this.selectedDate);
    this.menusService.getByDate(formattedDate).subscribe({
      next: (response) => {
        const dishes = response.data?.dishes || [];
        this.menuSections = [];

        const grouped: Record<number, MenuOption[]> = {};
        dishes.forEach((dish: any) => {
          const options = JSON.parse(dish.options || '[]') as string[];
          if (!grouped[dish.dish_type_id]) grouped[dish.dish_type_id] = [];
          grouped[dish.dish_type_id].push(
            ...options.map((name) => ({ name, selected: false }))
          );
        });

        this.menuSections = Object.entries(grouped).map(
          ([typeId, options]) => ({
            title:
              AppConstants.DISH_TYPES[
                +typeId as keyof typeof AppConstants.DISH_TYPES
              ] || `Tipo ${typeId}`,
            options,
          })
        );
      },
      error: (err) => {
        console.error(ConsoleMessages.ERRORS.LOADING_MENU, err);
        this.menuSections = [];
      },
    });
  }

  selectMenuType(index: number): void {
    this.menuTypes.forEach((type, i) => (type.selected = i === index));
  }

  selectOption(sectionIndex: number, optionIndex: number): void {
    const option = this.menuSections[sectionIndex].options[optionIndex];
    option.selected = !option.selected;

    if (option.selected) {
      this.menuSections[sectionIndex].options.forEach((opt, i) => {
        if (i !== optionIndex) opt.selected = false;
      });
    }
  }

  toggleTaper(): void {
    this.taperSelected = !this.taperSelected;
  }

  confirmSelection(): void {
    const selectedMenuType = this.menuTypes.find((type) => type.selected);
    if (!selectedMenuType) {
      this.alertService.show('error', Messages.ORDERS.SELECT_MENU_TYPE, '');
      return;
    }

    const toLocalMidnight = (d: Date | string | number): Date => {
      const dt = new Date(d);
      return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    };

    const today = toLocalMidnight(new Date());
    const selectedDateCopy = toLocalMidnight(this.selectedDate);

    if (selectedDateCopy <= today) {
      this.alertService.show('error', Messages.ORDERS.NO_PAST_ORDERS, '');
      return;
    }

    const sections = this.filteredMenuSections();
    const missingSelection = sections.some(
      (section) => !section.options.some((option) => option.selected)
    );
    if (missingSelection) {
      this.alertService.show('error', Messages.ORDERS.SELECT_ALL_OPTIONS, '');
      return;
    }

    const order_type_id = selectedMenuType.id;

    const option1 =
      this.menuSections
        .find((s) => s.title === AppConstants.DISH_TYPES[1])
        ?.options.find((o) => o.selected)?.name || '';
    const option2 =
      this.menuSections
        .find((s) => s.title === AppConstants.DISH_TYPES[2])
        ?.options.find((o) => o.selected)?.name || '';
    const option3 =
      this.menuSections
        .find((s) => s.title === AppConstants.DISH_TYPES[3])
        ?.options.find((o) => o.selected)?.name || '';

    const allergies = '';
    const order_date = this.formatDate(selectedDateCopy);

    const payload = {
      order_date,
      allergies,
      order_type_id,
      order_status_id: AppConstants.DEFAULT_ORDER_STATUS_ID,
      has_tupper: this.taperSelected,
      option1,
      option2,
      option3,
    };

    this.ordersService.checkDateAvailability(order_date).subscribe({
      next: (response) => {
        if (response.data?.available) {
          this.ordersService.createOrder(payload).subscribe({
            next: (response) => {
              this.alertService.show(
                'success',
                Messages.ORDERS.ORDER_SUCCESS,
                ''
              );
              this.route.navigate(['/']);
            },
            error: (err) => {
              this.alertService.show('error', Messages.ORDERS.ORDER_ERROR, '');
              console.error(err);
            },
          });
        } else {
          this.alertService.show('error', Messages.ORDERS.DUPLICATE_ORDER, '');
        }
      },
      error: (err) => {
        this.alertService.show(
          'error',
          Messages.ORDERS.DATE_AVAILABILITY_ERROR,
          ''
        );
      },
    });
  }

  hasSelectedMenuType(): boolean {
    return this.menuTypes.some((type) => type.selected);
  }

  getActualIndex(title: string): number {
    return this.menuSections.findIndex((section) => section.title === title);
  }

  filteredMenuSections(): MenuSection[] {
    const selected = this.menuTypes.find((type) => type.selected)?.name;

    if (!selected) return [];

    if (selected.includes('Primer plat') && selected.includes('Segon plat')) {
      return this.menuSections;
    } else if (selected.includes('Primer plat')) {
      return this.menuSections.filter(
        (section) =>
          section.title === AppConstants.DISH_TYPES[1] ||
          section.title === AppConstants.DISH_TYPES[3]
      );
    } else if (selected.includes('Segon plat')) {
      return this.menuSections.filter(
        (section) =>
          section.title === AppConstants.DISH_TYPES[2] ||
          section.title === AppConstants.DISH_TYPES[3]
      );
    } else {
      return [];
    }
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
