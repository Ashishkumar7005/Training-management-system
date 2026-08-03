import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/services/auth';
import { StatsService } from '../../shared/services/stats';

@Component({
  selector: 'app-employee-dashboard',
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
    { label: 'My Enrollments',   value: '...', icon: 'school',          color: '#6c3fc5', bg: '#ede7f6' },
    { label: 'Pending Approval', value: '...', icon: 'pending_actions',  color: '#e65100', bg: '#fff3e0' },
    { label: 'Completed',        value: '...', icon: 'verified',         color: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Available Courses',value: '...', icon: 'menu_book',        color: '#1565c0', bg: '#e3f2fd' }
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsService.getEmployeeStats().subscribe({
      next: (res: any) => {
        this.stats[0].value = res.myEnrollments.toString();
        this.stats[1].value = res.pending.toString();
        this.stats[2].value = res.completed.toString();
        this.stats[3].value = res.availableCourses.toString();
        this.cdr.detectChanges();
      },
      error: () => {
        this.stats.forEach(s => s.value = '0');
        this.cdr.detectChanges();
      }
    });
  }
}
