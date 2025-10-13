import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MenuOption, MenuSection } from '../../interfaces/menu';
import { WeeklyCalendarComponent } from '../../components/weekly-calendar/weekly-calendar.component';
import { API_CONFIG } from '../../environments/api.config';
import { OrdersService } from '../../Services/Orders/orders.service';
import { MenusService } from '../../Services/Menus/menu.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-selection',
  templateUrl: './menu-selection.component.html',
  styleUrls: ['./menu-selection.component.css'],
  standalone: true,
  imports: [CommonModule, WeeklyCalendarComponent],
})
export default class MenuSelectionComponent implements OnInit {
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
  ) { }

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
          selected: false
        }));
      },
      error: (err) => {
        console.error('Error loading order types:', err);
        this.orderTypes = [];
        this.menuTypes = [];
      }
    });
  }

  onDateSelected(date: Date): void {
    this.selectedDate = date;
    this.loadMenuFromBackend();
  }

  loadMenuFromBackend(): void {
    if (!this.selectedDate) return;

    const formattedDate = this.selectedDate.toISOString().split('T')[0];
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

        const typeMap: Record<number, string> = {
          1: 'Primer Plato',
          2: 'Segundo Plato',
          3: 'Postre',
        };

        this.menuSections = Object.entries(grouped).map(
          ([typeId, options]) => ({
            title: typeMap[+typeId] || `Tipo ${typeId}`,
            options,
          })
        );
      },
      error: (err) => {
        console.error('Error loading menu:', err);
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
      this.alertService.show('error', 'Selecciona un tipus de menú.', '');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateCopy = new Date(this.selectedDate);
    selectedDateCopy.setHours(0, 0, 0, 0);

    if (selectedDateCopy <= today) {
      this.alertService.show('error', 'No pots fer comandes per a avui ni dies anteriors.', '');
      return;
    }

    const sections = this.filteredMenuSections();
    const missingSelection = sections.some(section => !section.options.some(option => option.selected));
    if (missingSelection) {
      this.alertService.show('error', 'Si us plau, selecciona totes les opcions obligatòries del menú.', '');
      return;
    }

    const order_type_id = selectedMenuType.id;

    const option1 = this.menuSections.find(s => s.title === 'Primer Plato')?.options.find(o => o.selected)?.name || '';
    const option2 = this.menuSections.find(s => s.title === 'Segundo Plato')?.options.find(o => o.selected)?.name || '';
    const option3 = this.menuSections.find(s => s.title === 'Postre')?.options.find(o => o.selected)?.name || '';

    const allergies = '';
    const order_date = this.selectedDate.toISOString().split('T')[0];

    const payload = {
      order_date,
      allergies,
      order_type_id,
      order_status_id: 1,
      has_tupper: this.taperSelected,
      option1,
      option2,
      option3
    };

    this.ordersService.checkDateAvailability(order_date).subscribe({
      next: (response) => {
        if (response.data?.available) {
          this.ordersService.createOrder(payload).subscribe({
            next: (response) => {
              this.alertService.show('success', 'Comanda realitzada correctament.', '');
              this.route.navigate(['/']);
            },
            error: (err) => {
              this.alertService.show('error', 'Error al realitzar la comanda.', '');
              console.error(err);
            }
          });
        } else {
          this.alertService.show('error', 'No pots realitzar més d\'una comanda pel mateix dia.', '');
        }
      },
      error: (err) => {
        this.alertService.show('error', 'Error al verificar la disponibilitat de la data.', '');
      }
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
          section.title === 'Primer Plato' || section.title === 'Postre'
      );
    } else if (selected.includes('Segon plat')) {
      return this.menuSections.filter(
        (section) =>
          section.title === 'Segundo Plato' || section.title === 'Postre'
      );
    } else {
      return [];
    }
  }
}