import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDashboardComponent } from './orders-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('OrdersDashboardComponent', () => {
  let component: OrdersDashboardComponent;
  let fixture: ComponentFixture<OrdersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersDashboardComponent],
      providers: [
        provideHttpClient(),
        provideNativeDateAdapter(),
        provideAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
