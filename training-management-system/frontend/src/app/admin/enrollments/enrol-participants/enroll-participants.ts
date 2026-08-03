import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnrollmentService } from '../../../employee/services/enrollment';

@Component({
  selector: 'app-enroll-participants',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './enroll-participants.html',
  styleUrl: './enroll-participants.scss'
})
export class EnrollParticipantsComponent implements OnInit {

  enrollments: any[] = [];
  filteredEnrollments: any[] = [];
  isLoading = true;
  selectedFilter = 'Approved';
  enrollingId: string | null = null;

  filters = ['Approved', 'Enrolled', 'Rejected', 'Pending', 'All'];

  constructor(
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.enrollmentService.getAllEnrollments().subscribe({
      next: (res: any) => {
        this.enrollments = res.enrollments || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    this.filteredEnrollments = this.selectedFilter === 'All'
      ? this.enrollments
      : this.enrollments.filter(e => e.status === this.selectedFilter);
    this.cdr.detectChanges();
  }

  onFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  enrollParticipant(id: string): void {
    this.enrollingId = id;
    this.enrollmentService.enrollParticipant(id).subscribe({
      next: (res: any) => {
        this.enrollingId = null;
        this.showSnackBar(res.message, 'success');
        this.loadEnrollments();
      },
      error: (err: any) => {
        this.enrollingId = null;
        this.showSnackBar(err.error?.message || 'Failed to enroll', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'Pending':  '#e65100',
      'Approved': '#1565c0',
      'Rejected': '#c62828',
      'Enrolled': '#2e7d32'
    };
    return colors[status] || '#333';
  }

  showSnackBar(message: string, type: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
