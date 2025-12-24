import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../../config/api.config';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../Services/Alert/alert.service';

@Component({
  selector: 'app-top-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 pb-20 pt-24 px-4 sm:px-6">
      <div class="max-w-md mx-auto space-y-8">
        <!-- Back Button -->
        <button (click)="goBack()" class="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
          <mat-icon>arrow_back</mat-icon>
          <span class="font-medium">Tornar al perfil</span>
        </button>

        <div class="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 space-y-8 relative overflow-hidden">
          <!-- Header -->
          <div class="space-y-2 text-center">
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Afegir Saldo</h1>
            <p class="text-slate-500 text-lg">Selecciona la quantitat que vols afegir al teu compte</p>
          </div>

          <!-- Amount Selection Grid -->
          <div class="grid grid-cols-2 gap-4">
            <button *ngFor="let amount of predefinedAmounts"
                    (click)="selectAmount(amount)"
                    [class.ring-2]="selectedAmount === amount && !isCustomAmount"
                    [class.ring-primary]="selectedAmount === amount && !isCustomAmount"
                    [class.bg-slate-50]="selectedAmount !== amount"
                    [class.bg-primary-50]="selectedAmount === amount && !isCustomAmount"
                    class="p-4 rounded-2xl border border-slate-200 hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center gap-1 group">
              <span class="text-2xl font-black" [class.text-primary]="selectedAmount === amount && !isCustomAmount" [class.text-slate-700]="selectedAmount !== amount">{{ amount }}€</span>
            </button>
          </div>

          <!-- Custom Amount Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="text-slate-400 font-bold">€</span>
            </div>
            <input type="number"
                   [formControl]="customAmountControl"
                   (focus)="onCustomAmountFocus()"
                   placeholder="Altre quantitat"
                   class="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-lg text-slate-800">
          </div>

          <!-- Pay Button -->
          <button (click)="initiatePayment()"
                  [disabled]="!isValidAmount() || isLoading"
                  class="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 flex items-center justify-center gap-2">
            <span *ngIf="!isLoading">Pagar {{ getCurrentAmount() | currency:'EUR' }}</span>
            <span *ngIf="isLoading" class="flex items-center gap-2">
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processant...
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden Form for Redsys -->
    <form #redsysForm method="POST" [action]="redsysUrl" *ngIf="redsysParams">
      <input type="hidden" name="Ds_SignatureVersion" [value]="redsysParams.version"/>
      <input type="hidden" name="Ds_MerchantParameters" [value]="redsysParams.params"/>
      <input type="hidden" name="Ds_Signature" [value]="redsysParams.signature"/>
    </form>
  `
})
export class TopUpComponent {
  predefinedAmounts = [10, 20, 50, 100];
  selectedAmount: number | null = null;
  isCustomAmount = false;
  customAmountControl;
  isLoading = false;

  redsysUrl: string = '';
  redsysParams: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.customAmountControl = this.fb.control('', [Validators.min(1)]);
    this.customAmountControl.valueChanges.subscribe(() => {
      if (this.isCustomAmount) {
        this.selectedAmount = this.customAmountControl.value ? parseFloat(this.customAmountControl.value) : null;
      }
    });
  }

  selectAmount(amount: number) {
    this.isCustomAmount = false;
    this.selectedAmount = amount;
    this.customAmountControl.setValue('');
  }

  onCustomAmountFocus() {
    this.isCustomAmount = true;
    this.selectedAmount = this.customAmountControl.value ? parseFloat(this.customAmountControl.value) : null;
  }

  getCurrentAmount(): number {
    return this.selectedAmount || 0;
  }

  isValidAmount(): boolean {
    const amount = this.getCurrentAmount();
    return amount > 0;
  }

  goBack() {
    window.history.back();
  }

  initiatePayment() {
    if (!this.isValidAmount()) return;

    this.isLoading = true;
    const amount = this.getCurrentAmount();

    this.http.post<any>(`${API_CONFIG.baseUrl}/payment/initiate`, { amount }).subscribe({
      next: (response) => {
        this.redsysUrl = response.url;
        this.redsysParams = response;
        
        // Wait for change detection to render the form, then submit
        setTimeout(() => {
          const form = document.querySelector('form') as HTMLFormElement;
          if (form) {
            form.submit();
          } else {
             this.alertService.show('error', 'Error', 'No s\'ha pogut redirigir a la passarel·la de pagament.');
             this.isLoading = false;
          }
        }, 100);
      },
      error: (err) => {
        this.alertService.show('error', 'Error', 'No s\'ha pogut iniciar el pagament.');
        this.isLoading = false;
      }
    });
  }
}
