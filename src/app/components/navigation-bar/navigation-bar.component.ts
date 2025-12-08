import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: "app-navigation-bar",
  templateUrl: "./navigation-bar.component.html",
  styleUrls: ["./navigation-bar.component.css"],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class NavigationBarComponent {
  isAdmin = false;

  activeTab: 'food' | 'history' | 'admin' | 'profile' = 'food';

  constructor(private router: Router) { }

  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';

    this.updateActiveTab(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveTab(event.urlAfterRedirects);
      });
  }

  updateActiveTab(url: string) {
    if (url.includes('food')) {
      this.activeTab = 'food';
    } else if (url.includes('history')) {
      this.activeTab = 'history';
    } else if (url.includes('admin')) {
      this.activeTab = 'admin';
    } else {
      this.activeTab = 'profile';
    }
  }

  navigate(tab: typeof this.activeTab) {
    this.router.navigate([`/${tab}`]);
  }

  getNavClasses(tab: string): string {
    return `
      flex w-10 h-10 p-2 justify-center items-center rounded-lg cursor-pointer hover:bg-black/5
      ${this.activeTab === tab ? 'bg-black/5 text-[#009CA6]' : 'text-gray-600'}
    `;
  }
}