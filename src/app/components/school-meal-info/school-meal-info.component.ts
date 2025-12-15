import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-school-meal-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './school-meal-info.component.html',
  styleUrls: ['./school-meal-info.component.css'],
})
export class SchoolMealInfoComponent {
  mealIcon: string = `<svg id="109:126" layer-name="Frame" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[64px] h-[64px]">
    <path d="M8 5.33325V23.9999C8 26.9333 10.4 29.3333 13.3333 29.3333H24C25.4145 29.3333 26.771 28.7713 27.7712 27.7712C28.7714 26.771 29.3333 25.4144 29.3333 23.9999V5.33325" stroke="#009CA6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M18.6665 5.33325V58.6666" stroke="#009CA6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M55.9998 39.9999V5.33325C52.4636 5.33325 49.0722 6.73801 46.5717 9.23849C44.0713 11.739 42.6665 15.1304 42.6665 18.6666V34.6666C42.6665 37.5999 45.0665 39.9999 47.9998 39.9999H55.9998ZM55.9998 39.9999V58.6666" stroke="#009CA6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;
}
