import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-10 max-w-sm w-full text-center space-y-6">
        
        <div *ngIf="status === 'ok'" class="space-y-6">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <mat-icon class="scale-150">check_circle</mat-icon>
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-black text-slate-800">Pagament Realitzat!</h1>
            <p class="text-slate-500">El teu saldo s'ha actualitzat correctament.</p>
          </div>
        </div>

        <div *ngIf="status === 'ko'" class="space-y-6">
          <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
             <mat-icon class="scale-150">error</mat-icon>
          </div>
           <div class="space-y-2">
            <h1 class="text-2xl font-black text-slate-800">Error en el Pagament</h1>
            <p class="text-slate-500">No s'ha pogut completar la transacció.</p>
          </div>
        </div>
        
        <button (click)="goToProfile()" class="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 py-3 rounded-xl font-bold transition-colors">
          Tornar al perfil
        </button>

      </div>
    </div>
  `
})
export class PaymentResultComponent implements OnInit {
  status: 'ok' | 'ko' = 'ko';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'] === 'ok' ? 'ok' : 'ko';
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
