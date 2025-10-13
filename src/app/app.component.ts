import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { AlertContainerComponent } from './components/alert-container/alert-container.component';
import { FooterComponent } from "./components/footer/footer.component";
import { NavigationConfig } from './environments/navigation.config';

@Component({
  selector: 'app-root',
  imports: [
    NavigationBarComponent,
    RouterOutlet,
    AlertContainerComponent,
    CommonModule,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  showNav = true;
  title = 'testMenu1';

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const url = this.router.url;

      this.showNav = !(
        url === '/' + NavigationConfig.LOGIN ||
        url === '/' + NavigationConfig.FORGOT_PASSWORD ||
        url === '/' + NavigationConfig.REGISTER
      );
    });
  }
}
