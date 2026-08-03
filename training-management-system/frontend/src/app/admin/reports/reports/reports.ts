import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
// import {Chart} from 'chart.js/auto';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent implements OnInit {

  // Tab data
  batches:          any[] = [];
  enrollments:      any[] = [];
  statusSummary:    any   = null;
  courseBreakdown:  any[] = [];

  // Loading states
  loadingCalendar    = true;
  loadingRequests    = true;
  loadingStatus      = true;

  // Search/Filter
  searchCalendar    = '';
  searchRequests    = '';
  selectedStatus    = 'All';

  filteredBatches      : any[] = [];
  filteredEnrollments  : any[] = [];

  statusFilters = ['All', 'Pending', 'Approved', 'Rejected', 'Enrolled', 'Completed'];

  private apiUrl = 'http://localhost:5000/api/reports';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCalendarReport();
    this.loadRequestsReport();
    this.loadStatusReport();
  }

  loadCalendarReport(): void {
    this.loadingCalendar = true;
    this.http.get(`${this.apiUrl}/course-calendar`).subscribe({
      next: (res: any) => {
        this.batches         = res.batches || [];
        this.filteredBatches = res.batches || [];
        this.loadingCalendar = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingCalendar = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRequestsReport(): void {
    this.loadingRequests = true;
    this.http.get(`${this.apiUrl}/enrollment-requests`).subscribe({
      next: (res: any) => {
        this.enrollments         = res.enrollments || [];
        this.filteredEnrollments = res.enrollments || [];
        this.loadingRequests     = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingRequests = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStatusReport(): void {
    this.loadingStatus = true;
    this.http.get(`${this.apiUrl}/enrollment-status`).subscribe({
      next: (res: any) => {
        this.statusSummary   = res.summary;
        this.courseBreakdown = res.courseBreakdown || [];
        this.loadingStatus   = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingStatus = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Search calendar
  onSearchCalendar(): void {
    const text = this.searchCalendar.toLowerCase();
    this.filteredBatches = this.batches.filter(b =>
      b.batchName?.toLowerCase().includes(text)         ||
      b.batchCode?.toLowerCase().includes(text)         ||
      b.course?.courseName?.toLowerCase().includes(text)||
      b.course?.courseCode?.toLowerCase().includes(text)
    );
    this.cdr.detectChanges();
  }

  // Search + filter enrollments
  onSearchRequests(): void {
    this.applyEnrollmentFilter();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyEnrollmentFilter();
  }

  applyEnrollmentFilter(): void {
    let filtered = [...this.enrollments];

    if (this.selectedStatus !== 'All') {
      filtered = filtered.filter(e => e.status === this.selectedStatus);
    }

    if (this.searchRequests) {
      const text = this.searchRequests.toLowerCase();
      filtered = filtered.filter(e =>
        e.employee?.firstName?.toLowerCase().includes(text) ||
        e.employee?.lastName?.toLowerCase().includes(text)  ||
        e.employee?.employeeId?.toLowerCase().includes(text)||
        e.course?.courseName?.toLowerCase().includes(text)  ||
        e.batch?.batchName?.toLowerCase().includes(text)
      );
    }

    this.filteredEnrollments = filtered;
    this.cdr.detectChanges();
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'Pending':   '#e65100',
      'Approved':  '#1565c0',
      'Rejected':  '#c62828',
      'Enrolled':  '#2e7d32',
      'Completed': '#6a1b9a',
      'Upcoming':  '#1565c0',
      'Ongoing':   '#2e7d32',
      'Cancelled': '#c62828'
    };
    return colors[status] || '#333';
  }

  getBatchStatusColor(status: string): string {
    return this.getStatusColor(status);
  }

  getPercentage(value: number): number {
    if (!this.statusSummary?.total) return 0;
    return Math.round((value / this.statusSummary.total) * 100);
  }

  getStatusItems(): any[] {
  if (!this.statusSummary) return [];
  return [
    { label: 'Pending',   value: this.statusSummary.requested, color: '#e65100', icon: 'pending_actions' },
    { label: 'Approved',  value: this.statusSummary.approved,  color: '#1565c0', icon: 'thumb_up'        },
    { label: 'Rejected',  value: this.statusSummary.rejected,  color: '#c62828', icon: 'cancel'          },
    { label: 'Enrolled',  value: this.statusSummary.enrolled,  color: '#2e7d32', icon: 'check_circle'    },
    { label: 'Completed', value: this.statusSummary.completed, color: '#6a1b9a', icon: 'verified'        }
  ];
}

getDonutDash(value: number): number {
  if (!this.statusSummary?.total) return 0;
  const circumference = 2 * Math.PI * 70; // 439.8
  return (value / this.statusSummary.total) * circumference;
}

getDonutOffset(index: number): number {
  const circumference = 2 * Math.PI * 70;
  const items = this.getStatusItems();
  let offset = circumference * 0.25;
  for (let i = 0; i <= index; i++) {
    offset -= (items[i].value / this.statusSummary.total) * circumference;
  }
  return offset;
}

getBarWidth(value: number): number {
  const max = Math.max(...this.courseBreakdown.map((c: any) => c.total));
  if (!max) return 0;
  return (value / max) * 100;
}

getBarColor(index: number): string {
  const colors = ['#6c3fc5', '#00897b', '#1565c0', '#e65100', '#c62828', '#2e7d32'];
  return colors[index % colors.length];
}
}