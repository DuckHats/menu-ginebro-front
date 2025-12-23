import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DayInfo } from "../../interfaces/day-info";

@Component({
  selector: "app-weekly-calendar",
  templateUrl: "./weekly-calendar.component.html",
  styleUrls: ["./weekly-calendar.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class WeeklyCalendarComponent implements OnInit {
  @Input() initialDate: Date = new Date();
  @Input() disabledDates: string[] = []; // Format YYYY-MM-DD
  @Output() daySelected = new EventEmitter<Date>();
  @Output() weekChanged = new EventEmitter<Date>(); // Emits Monday of the week

  days: DayInfo[] = [];
  currentWeekDisplay: string = "";
  currentWeekStartDate: Date = new Date();

  private dayNames = ["lun", "mar", "mié", "jue", "vie"];

  ngOnInit() {
    this.initializeCalendar();
  }

  initializeCalendar() {
    // Find the Monday of the current week
    const currentDate = new Date(this.initialDate);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

    this.currentWeekStartDate = new Date(currentDate.setDate(diff));
    this.updateWeekDisplay();
    this.generateDays();
    this.weekChanged.emit(this.currentWeekStartDate);
  }

  updateWeekDisplay() {
    // Format the date as "24 de febrero"
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };
    this.currentWeekDisplay = this.currentWeekStartDate.toLocaleDateString(
      "es-ES",
      options,
    );
  }

  generateDays() {
    this.days = [];
    const startDate = new Date(this.currentWeekStartDate);
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const isSelected = false;
      const isHighlighted = false;

      const isToday =
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getDay() >= 1 && currentDate.getDay() <= 5;

      const formattedDate = this.formatDate(currentDate);
      const isDisabled = this.disabledDates.includes(formattedDate);

      this.days.push({
        dayName: this.dayNames[i],
        dayNumber: currentDate.getDate(),
        isSelected,
        isHighlighted,
        isToday,
        isDisabled
      });
    }

  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  navigatePreviousWeek() {
    const newStartDate = new Date(this.currentWeekStartDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    this.currentWeekStartDate = newStartDate;
    this.updateWeekDisplay();
    this.generateDays();
    this.weekChanged.emit(this.currentWeekStartDate);
  }

  navigateNextWeek() {
    const newStartDate = new Date(this.currentWeekStartDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    this.currentWeekStartDate = newStartDate;
    this.updateWeekDisplay();
    this.generateDays();
    this.weekChanged.emit(this.currentWeekStartDate);
  }

  selectDay(day: DayInfo) {
    if (day.isDisabled) return;

    // Deselect all days
    this.days.forEach((d) => (d.isSelected = false));

    // Select the clicked day
    day.isSelected = true;

    // Calculate the actual date
    const selectedDate = new Date(this.currentWeekStartDate);
    const index = this.days.indexOf(day);
    selectedDate.setDate(selectedDate.getDate() + index);
    selectedDate.setHours(12, 0, 0, 0);
    // Emit the selected date
    this.daySelected.emit(selectedDate);
  }
}
