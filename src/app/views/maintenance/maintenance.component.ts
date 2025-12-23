import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConstants } from '../../config/app-constants.config';
import { NavigationConfig } from '../../config/navigation.config';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-light/30 to-white flex flex-col items-center justify-center p-6 text-center" @fadeIn>
      <div class="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-primary-light/50 relative overflow-hidden">
        <!-- Animated Background Element -->
        <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary-light/50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        
        <!-- Icon -->
        <div class="w-24 h-24 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-12 hover:rotate-0 transition-transform duration-500">
          <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ AppConstants.CONFIGURATION.LABELS.MAINTENANCE_TITLE }}</h1>
        <p class="text-gray-600 mb-8 leading-relaxed">
          {{ AppConstants.CONFIGURATION.LABELS.MAINTENANCE_DESC }}
        </p>

        <div class="space-y-6">
          <div class="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-primary w-1/2 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
          
          <div class="pt-4 border-t border-gray-50">
            <button (click)="logout()" class="flex items-center justify-center gap-2 mx-auto px-6 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all group">
              <svg class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Tancar sessió</span>
            </button>
          </div>

          <p class="text-xs text-gray-400 uppercase tracking-widest font-semibold">{{ AppConstants.CONFIGURATION.LABELS.MAINTENANCE_FOOTER }}</p>
        </div>
      </div>
      
      <p class="mt-8 text-sm text-gray-400">© {{ year }} Duckhats. Tots els drets reservats.</p>
    </div>
  `,
  styles: [`
    @keyframes loading {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, scale: 0.95 }),
        animate('500ms ease-out', style({ opacity: 1, scale: 1 }))
      ])
    ])
  ]
})
export class MaintenanceComponent {
  private router = inject(Router);
  AppConstants = AppConstants;
  year = new Date().getFullYear();

  logout() {
    this.router.navigate([NavigationConfig.LOGOUT]);
  }
}
