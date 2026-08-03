import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/services/auth';
import { StatsService } from '../../shared/services/stats';

@Component({
  selector: 'app-manager-dashboard',
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
    { label: 'Pending Approvals', value: '...', icon: 'pending_actions', color: '#e65100', bg: '#fff3e0' },
    { label: 'Approved',          value: '...', icon: 'check_circle',    color: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Rejected',          value: '...', icon: 'cancel',          color: '#c62828', bg: '#ffebee' },
    { label: 'Available Batches', value: '...', icon: 'group',           color: '#00897b', bg: '#e0f2f1' }
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getManagerStats().subscribe({
      next: (res: any) => {
        this.stats[0].value = res.pending.toString();
        this.stats[1].value = res.approved.toString();
        this.stats[2].value = res.rejected.toString();
        this.stats[3].value = res.availableBatches.toString();
        this.cdr.detectChanges();
      },
      error: () => {
        this.stats.forEach(s => s.value = '0');
        this.cdr.detectChanges();
      }
    });
  }
}