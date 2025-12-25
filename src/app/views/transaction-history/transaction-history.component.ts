import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  TransactionService,
  Transaction,
} from '../../Services/Transaction/transaction.service';
import { ConfigurationService } from '../../Services/Admin/configuration/configuration.service';
import { UILabels } from '../../config/ui-labels.config';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './transaction-history.component.html',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class TransactionHistoryComponent implements OnInit, OnDestroy {
  @Input() isAdmin: boolean = false;

  UILabels = UILabels;
  transactions: Transaction[] = [];
  loading = true;

  // Pagination & Sorting State
  page = 1;
  perPage = 15;
  sortBy = 'created_at';
  sortOrder = 'desc';
  totalPages = 1;
  totalItems = 0;
  search = '';

  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  onSearch(): void {
    this.search$.next(this.search);
  }

  constructor(
    private transactionService: TransactionService,
    private configService: ConfigurationService
  ) {}

  ngOnInit(): void {
    if (this.isAdmin) {
      this.loadPaginationSettings();
    } else {
      this.loadTransactions();
    }
    this.setupReactiveSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupReactiveSearch(): void {
    this.search$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;
        this.loadTransactions();
      });
  }

  loadPaginationSettings(): void {
    this.configService.getConfigurations().subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data?.transaction_per_page) {
          this.perPage = parseInt(res.data.transaction_per_page);
        }
        this.loadTransactions();
      },
      error: () => {
        this.loadTransactions();
      },
    });
  }

  loadTransactions(): void {
    this.loading = true;
    const params = {
      page: this.page,
      per_page: this.perPage,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      search: this.search,
    };

    const stream$ = this.isAdmin
      ? this.transactionService.getAdminTransactions(params)
      : this.transactionService.getTransactions(params);

    stream$.subscribe({
      next: (res: any) => {
        this.transactions = res.data || [];
        this.totalPages = res.meta?.last_page || 1;
        this.totalItems = res.meta?.total || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(page: number): void {
    this.page = page;
    this.loadTransactions();
  }

  sort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadTransactions();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'topup':
        return UILabels.TRANSACTIONS.TYPES.TOPUP;
      case 'order':
        return UILabels.TRANSACTIONS.TYPES.ORDER;
      case 'correction':
        return UILabels.TRANSACTIONS.TYPES.CORRECTION;
      default:
        return type;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'failed':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
