import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/services/auth';
import { StatsService } from '../../shared/services/stats';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private statsService: StatsService,
    private cdr: ChangeDetectorRef
  ) {}

  get user() { return this.authService.getUser(); }

  stats = [
    { label: 'Total Courses',    value: '...', icon: 'menu_book',  color: '#6c3fc5', bg: '#ede7f6' },
    { label: 'Active Batches',   value: '...', icon: 'group',      color: '#00897b', bg: '#e0f2f1' },
    { label: 'Total Users',      value: '...', icon: 'people',     color: '#1565c0', bg: '#e3f2fd' },
    { label: 'Pending Requests', value: '...', icon: 'pending',    color: '#e65100', bg: '#fff3e0' }
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getAdminStats().subscribe({
      next: (res: any) => {
        this.stats[0].value = res.totalCourses.toString();
        this.stats[1].value = res.activeBatches.toString();
        this.stats[2].value = res.totalUsers.toString();
        this.stats[3].value = res.pendingRequests.toString();
        this.cdr.detectChanges();
      },
      error: () => {
        this.stats.forEach(s => s.value = '0');
        this.cdr.detectChanges();
      }
    });
  }
}