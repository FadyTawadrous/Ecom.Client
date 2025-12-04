import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AdminApiService,
  AdminDashboardVM,
  DailyOrdersVM,
  RecentOrderVM
} from '../services/admin-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  stats: AdminDashboardVM | null = null;
  loading = false;
  error: string | null = null;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.error = null;

    this.adminApi.getDashboardOverview().subscribe({
      next: (data) => {
        console.log('OrdersLast7Days:', data.ordersLast7Days); // DEBUG
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard error', err);
        this.error = 'Failed to load dashboard data.';
        this.loading = false;
      }
    });
  }

  // ---------- CHART HELPERS ----------

  get maxOrdersLast7Days(): number {
    if (!this.stats?.ordersLast7Days?.length) return 0;
    return Math.max(...this.stats.ordersLast7Days.map(d => Number(d.ordersCount) || 0));
  }

  getBarHeight(d: DailyOrdersVM): number {
    const max = this.maxOrdersLast7Days || 1;
    const count = Number(d.ordersCount) || 0;

    const ratio = count / max;

    // Minimum 10px, maximum close to chart height
    return 10 + ratio * 140;
  }

  formatDay(item: DailyOrdersVM): string {
    const d = new Date(item.date);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  statusClasses(status: string): string {
    switch (status) {
      case 'Pending':    return 'bg-amber-100 text-amber-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped':    return 'bg-purple-100 text-purple-700';
      case 'Delivered':  return 'bg-emerald-100 text-emerald-700';
      case 'Cancelled':  return 'bg-red-100 text-red-700';
      case 'Returned':   return 'bg-orange-100 text-orange-700';
      default:           return 'bg-slate-100 text-slate-600';
    }
  }

  formatOrderDate(o: RecentOrderVM): string {
    return new Date(o.createdOn).toLocaleString();
  }
}
