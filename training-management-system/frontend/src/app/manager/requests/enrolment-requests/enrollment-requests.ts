import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnrollmentService } from '../../../employee/services/enrollment';

@Component({
  selector: 'app-enrollment-requests',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './enrollment-requests.html',
  styleUrl: './enrollment-requests.scss'
})
export class EnrollmentRequestsComponent implements OnInit {

  enrollments: any[] = [];
  filteredEnrollments: any[] = [];
  isLoading = true;
  selectedFilter = 'Pending';
  rejectingId: string | null = null;
  approvingId: string | null = null;

  // Rejection form
  showRejectForm: string | null = null;
  rejectForm!: FormGroup;

  filters = ['Pending', 'Approved', 'Rejected', 'All'];

  constructor(
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rejectForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.enrollmentService.getManagerRequests().subscribe({
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
    if (this.selectedFilter === 'All') {
      this.filteredEnrollments = this.enrollments;
    } else {
      this.filteredEnrollments = this.enrollments.filter(
        e => e.status === this.selectedFilter
      );
    }
    this.cdr.detectChanges();
  }

  onFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  approve(id: string): void {
    this.approvingId = id;
    this.enrollmentService.approveEnrollment(id).subscribe({
      next: (res: any) => {
        this.approvingId = null;
        this.showSnackBar(res.message, 'success');
        this.loadRequests();
      },
      error: (err: any) => {
        this.approvingId = null;
        this.showSnackBar(err.error?.message || 'Failed to approve', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  toggleRejectForm(id: string): void {
    this.showRejectForm = this.showRejectForm === id ? null : id;
    this.rejectForm.reset();
    this.cdr.detectChanges();
  }

  reject(id: string): void {
    if (this.rejectForm.invalid) return;

    this.rejectingId = id;
    const reason = this.rejectForm.get('reason')?.value;

    this.enrollmentService.rejectEnrollment(id, reason).subscribe({
      next: (res: any) => {
        this.rejectingId = null;
        this.showRejectForm = null;
        this.showSnackBar(res.message, 'success');
        this.loadRequests();
      },
      error: (err: any) => {
        this.rejectingId = null;
        this.showSnackBar(err.error?.message || 'Failed to reject', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'Pending':  '#e65100',
      'Approved': '#1565c0',
      'Rejected': '#c62828'
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