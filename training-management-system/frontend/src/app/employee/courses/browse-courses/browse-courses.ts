import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnrollmentService } from '../../services/enrollment';

@Component({
  selector: 'app-browse-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './browse-courses.html',
  styleUrl: './browse-courses.scss'
})
export class BrowseCoursesComponent implements OnInit {

  batches: any[] = [];
  filteredBatches: any[] = [];
  isLoading = true;
  searchText = '';
  requestingId: string | null = null;

  constructor(
    private enrollmentService: EnrollmentService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
  this.isLoading = true;
  this.cdr.detectChanges();

  this.enrollmentService.getAvailableBatches().subscribe({
    next: (res: any) => {
      this.batches = res.batches || [];
      this.filteredBatches = res.batches || [];
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.isLoading = false;
      this.cdr.detectChanges();
      this.showSnackBar('Failed to load batches', 'error');
    }
  });
}

getRequestStatus(batch: any): string {
  if (!batch.alreadyRequested) return 'none';
  return batch.requestStatus || 'Pending';
}

getRequestButtonColor(status: string): string {
  const colors: any = {
    'Pending':  '#e65100',
    'Approved': '#2e7d32',
    'Rejected': '#c62828',
    'Enrolled': '#1565c0'
  };
  return colors[status] || '#e65100';
}

getRequestButtonIcon(status: string): string {
  const icons: any = {
    'Pending':  'hourglass_empty',
    'Approved': 'thumb_up',
    'Rejected': 'thumb_down',
    'Enrolled': 'check_circle'
  };
  return icons[status] || 'hourglass_empty';
}

  onSearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredBatches = this.batches.filter(b =>
      b.course?.courseName?.toLowerCase().includes(text) ||
      b.batchName?.toLowerCase().includes(text) ||
      b.course?.category?.toLowerCase().includes(text)
    );
    this.cdr.detectChanges();
  }

  requestEnrollment(batch: any): void {
    this.requestingId = batch._id;
    this.enrollmentService.requestEnrollment(batch._id).subscribe({
      next: (res: any) => {
        this.requestingId = null;
        this.showSnackBar(res.message, 'success');
        this.loadBatches();
      },
      error: (err: any) => {
        this.requestingId = null;
        this.showSnackBar(err.error?.message || 'Failed to request enrolment', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  getCategoryColor(category: string): string {
    return category === 'Technical' ? '#1565c0' : '#6a1b9a';
  }

  getModeColor(mode: string): string {
    const colors: any = {
      'Online': '#2e7d32', 'Offline': '#e65100', 'Hybrid': '#00838f'
    };
    return colors[mode] || '#333';
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
