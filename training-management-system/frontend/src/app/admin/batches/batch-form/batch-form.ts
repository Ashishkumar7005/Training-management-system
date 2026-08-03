import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BatchService } from '../services/batch';
import { CourseService } from '../../courses/services/course';

@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './batch-form.html',
  styleUrl: './batch-form.scss'
})
export class BatchFormComponent implements OnInit {

  batchForm!: FormGroup;
  isLoading  = false;
  isEditMode = false;
  courses: any[] = [];

  statuses = ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'];
  minDate: Date = new Date(); // today's date
  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<BatchFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.initForm();
    this.loadCourses();
    if (this.isEditMode) this.patchForm();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (res: any) => {
        this.courses = res.courses?.filter((c: any) => c.status === 'Active') || [];
        this.cdr.detectChanges();
      },
      error: () => this.showSnackBar('Failed to load courses', 'error')
    });
  }

  initForm(): void {
    this.batchForm = this.fb.group({
      batchName:       ['', [Validators.required, Validators.minLength(3)]],
      batchCode:       ['', Validators.required],
      course:          ['', Validators.required],
      startDate:       ['', Validators.required],
      endDate:         ['', Validators.required],
      startTime:       ['', Validators.required],
      endTime:         ['', Validators.required],
      venue:           ['Online'],
      maxParticipants: ['', [Validators.required, Validators.min(1)]],
      status:          ['Upcoming']
    });
  }

  patchForm(): void {
    const b = this.data.batch;
    this.batchForm.patchValue({
      batchName:       b.batchName,
      batchCode:       b.batchCode,
      course:          b.course?._id,
      startDate:       new Date(b.startDate),
      endDate:         new Date(b.endDate),
      startTime:       b.startTime,
      endTime:         b.endTime,
      venue:           b.venue,
      maxParticipants: b.maxParticipants,
      status:          b.status
    });
  }

  onSubmit(): void {
    console.log('Form valid:', this.batchForm.valid);
  console.log('Form values:', this.batchForm.value);
  console.log('Form errors:', this.batchForm.errors);
    if (this.batchForm.invalid) return;

    this.isLoading = true;

    const action = this.isEditMode
      ? this.batchService.updateBatch(this.data.batch._id, this.batchForm.value)
      : this.batchService.createBatch(this.batchForm.value);

    action.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.showSnackBar(res.message, 'success');
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.showSnackBar(err.error?.message || 'Something went wrong', 'error');
      }
    });
  }

  onCancel(): void { this.dialogRef.close(false); }

  hasError(field: string, error: string): boolean {
    const control = this.batchForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
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
