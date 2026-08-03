import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseService } from '../services/course';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-course-form',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss'
})
export class CourseFormComponent implements OnInit {

  courseForm!: FormGroup;
  isLoading = false;
  isEditMode = false;

  categories    = ['Technical', 'Non-Technical'];
  durationUnits = ['Days', 'Hours'];
  modes         = ['Online', 'Offline', 'Hybrid'];
  departments   = ['HR', 'IT', 'Finance', 'Operations', 'Sales', 'Marketing', 'All'];
  statuses      = ['Active', 'Inactive'];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CourseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.initForm();
    if (this.isEditMode) this.patchForm();
  }

 initForm(): void {
  this.courseForm = this.fb.group({
    courseName:      ['', [Validators.required, Validators.minLength(3)]],
    courseCode:      ['', [Validators.required, Validators.minLength(2)]],
    category:        ['', Validators.required],
    description:     ['', [Validators.required, Validators.minLength(10)]],
    duration:        ['', [Validators.required, Validators.min(1)]],
    durationUnit:    ['Days', Validators.required],
    trainingMode:    ['', Validators.required],
    maxParticipants: ['', [Validators.required, Validators.min(1)]],
    trainerName:     ['', Validators.required],
    prerequisites:   ['None'],
    department:      ['All'],
    status:          ['Active']
  });
}

  patchForm(): void {
    const c = this.data.course;
    this.courseForm.patchValue({
      courseName:      c.courseName,
      courseCode:      c.courseCode,
      category:        c.category,
      description:     c.description,
      duration:        c.duration,
      durationUnit:    c.durationUnit,
      trainingMode:    c.trainingMode,
      maxParticipants: c.maxParticipants,
      trainerName:     c.trainerName,
      prerequisites:   c.prerequisites,
      department:      c.department,
      status:          c.status
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) return;

    this.isLoading = true;

    const action = this.isEditMode
      ? this.courseService.updateCourse(this.data.course._id, this.courseForm.value)
      : this.courseService.createCourse(this.courseForm.value);

    action.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackBar.open(res.message, 'Close', {
          duration: 3000,
          panelClass: 'snack-success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(
          err.error?.message || 'Something went wrong',
          'Close',
          { duration: 3000, panelClass: 'snack-error',
            horizontalPosition: 'right', verticalPosition: 'top' }
        );
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  hasError(field: string, error: string): boolean {
    const control = this.courseForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }
}