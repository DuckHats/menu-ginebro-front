import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../../config/api.config';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../../Services/Alert/alert.service';
import { AuthService } from '../../../Services/Auth/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

import { ConfigurationService } from '../../../Services/Admin/configuration/configuration.service';
import { ActivatedRoute } from '@angular/router';
import { AppConstants } from '../../../config/app-constants.config';
import { Messages } from '../../../config/messages.config';

@Component({
  selector: 'app-top-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
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
  templateUrl: './top-up.component.html',
})
export class TopUpComponent {
  AppConstants = AppConstants;
  predefinedAmounts = AppConstants.TOP_UP.PREDEFINED_AMOUNTS;
  selectedAmount: number | null = null;
  isCustomAmount = false;
  customAmountControl;
  isLoading = false;

  topUpMode: 'direct' | 'packs' = AppConstants.TOP_UP.MODES.DIRECT as any;

  prices = {
    menu_price: 0,
    taper_price: 0,
    half_menu_first_price: 0,
    half_menu_second_price: 0,
  };

  quantities = {
    full_menu: 0,
    taper: 0,
    half_menu_first: 0,
    half_menu_second: 0,
  };

  redsysUrl: string = '';
  redsysParams: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private authService: AuthService,
    private configService: ConfigurationService,
    private route: ActivatedRoute
  ) {
    this.customAmountControl = this.fb.control('', [
      Validators.min(1),
      Validators.max(150),
    ]);
    this.loadPrices();

    // Check for amount in query params
    this.route.queryParams.subscribe((params) => {
      if (params['amount']) {
        const amount = parseFloat(params['amount']);
        if (!isNaN(amount) && amount > 0) {
          this.isCustomAmount = true;
          this.selectedAmount = amount;
          this.customAmountControl.setValue(amount.toString());
        }
      }
    });

    this.customAmountControl.valueChanges.subscribe(() => {
      if (this.isCustomAmount) {
        this.selectedAmount = this.customAmountControl.value
          ? parseFloat(this.customAmountControl.value)
          : null;
      }
    });
  }

  loadPrices() {
    this.configService.getConfigurations().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.prices = {
            menu_price: parseFloat(res.data.menu_price) || 0,
            taper_price: parseFloat(res.data.taper_price) || 0,
            half_menu_first_price:
              parseFloat(res.data.half_menu_first_price) || 0,
            half_menu_second_price:
              parseFloat(res.data.half_menu_second_price) || 0,
          };
        }
      },
    });
  }

  setMode(mode: 'direct' | 'packs') {
    this.topUpMode = mode;
    this.selectedAmount = null;
    this.isCustomAmount = false;
    this.customAmountControl.setValue('');
    if (mode === 'direct') {
      this.resetQuantities();
    }
  }

  updateQuantity(
    type: keyof typeof TopUpComponent.prototype.quantities,
    delta: number
  ) {
    const newVal = this.quantities[type] + delta;
    if (newVal >= 0) {
      this.quantities[type] = newVal;
      this.calculatePacksAmount();
    }
  }

  resetQuantities() {
    this.quantities = {
      full_menu: 0,
      taper: 0,
      half_menu_first: 0,
      half_menu_second: 0,
    };
  }

  calculatePacksAmount() {
    const total =
      this.quantities.full_menu * this.prices.menu_price +
      this.quantities.taper * this.prices.taper_price +
      this.quantities.half_menu_first * this.prices.half_menu_first_price +
      this.quantities.half_menu_second * this.prices.half_menu_second_price;

    this.selectedAmount = Math.round(total * 100) / 100;
  }

  selectAmount(amount: number) {
    this.isCustomAmount = false;
    this.selectedAmount = amount;
    this.customAmountControl.setValue('');
  }

  onCustomAmountFocus() {
    this.isCustomAmount = true;
    this.selectedAmount = this.customAmountControl.value
      ? parseFloat(this.customAmountControl.value)
      : null;
  }

  getCurrentAmount(): number {
    return this.selectedAmount || 0;
  }

  isValidAmount(): boolean {
    const amount = this.getCurrentAmount();
    return amount > 0 && amount <= 150;
  }

  isExceedingLimit(): boolean {
    return this.getCurrentAmount() > 150;
  }

  goBack() {
    window.history.back();
  }

  initiatePayment() {
    if (!this.isValidAmount()) return;

    this.isLoading = true;
    const amount = this.getCurrentAmount();

    // Ensure CSRF cookie is present for the stateful API request
    this.authService.getCsrfCookie().subscribe({
      next: () => {
        this.http
          .post<any>(`${API_CONFIG.baseUrl}/payment/initiate`, { amount })
          .subscribe({
            next: (response) => {
              if (response.action === 'redirect') {
                window.location.href = response.url;
              } else {
                this.redsysUrl = response.url;
                this.redsysParams = response;

                // Wait for change detection to render the form, then submit
                setTimeout(() => {
                  const form = document.querySelector(
                    'form'
                  ) as HTMLFormElement;
                  if (form) {
                    form.submit();
                  } else {
                    this.alertService.show(
                      'error',
                      Messages.GENERIC.ERROR,
                      Messages.PAYMENT.REDSYS_REDIRECT_ERROR
                    );
                    this.isLoading = false;
                  }
                }, 100);
              }
            },
            error: (err) => {
              this.alertService.show(
                'error',
                Messages.GENERIC.ERROR,
                Messages.PAYMENT.INITIATE_ERROR
              );
              this.isLoading = false;
            },
          });
      },
      error: () => {
        this.alertService.show(
          'error',
          Messages.GENERIC.ERROR,
          Messages.PAYMENT.SERVER_CONNECTION_ERROR
        );
        this.isLoading = false;
      },
    });
  }
}
