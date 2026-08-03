import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnrollmentService } from '../../services/enrollment';

@Component({
  selector: 'app-my-enrolments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './my-enrollments.html',
  styleUrl: './my-enrollments.scss'
})
export class MyEnrollmentsComponent implements OnInit {

  enrollments: any[] = [];
  isLoading = true;

  constructor(
    private enrollmentService: EnrollmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEnrolments();
  }

  loadEnrolments(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.enrollmentService.getMyEnrollments().subscribe({
      next: (res: any) => {
        this.enrollments = res.enrollments || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'Pending':   '#e65100',
      'Approved':  '#1565c0',
      'Rejected':  '#c62828',
      'Enrolled':  '#2e7d32',
      'Completed': '#6a1b9a'
    };
    return colors[status] || '#333';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'Pending':   'pending_actions',
      'Approved':  'thumb_up',
      'Rejected':  'thumb_down',
      'Enrolled':  'check_circle',
      'Completed': 'verified'
    };
    return icons[status] || 'info';
  }
}
