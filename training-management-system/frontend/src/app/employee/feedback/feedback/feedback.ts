import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {FeedbackService} from "../../services/feedback"

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss'
})
export class FeedbackComponent implements OnInit {

  enrollments:     any[] = [];
  myFeedbacks:     any[] = [];
  isLoading        = true;
  isSubmitting     = false;
  selectedEnrollment: any = null;
  feedbackForm!:   FormGroup;
  activeTab        = 'submit'; // 'submit' | 'history'

  courseRating  = 0;
  trainerRating = 0;

  experiences = ['Excellent', 'Good', 'Average', 'Poor'];

  constructor(
    private feedbackService: FeedbackService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEligibleEnrollments();
    this.loadMyFeedback();
  }

  initForm(): void {
    this.feedbackForm = this.fb.group({
      courseRating:      [0,  [Validators.required, Validators.min(1)]],
      trainerRating:     [0,  [Validators.required, Validators.min(1)]],
      courseComments:    ['', [Validators.required, Validators.minLength(10)]],
      trainerComments:   ['', [Validators.required, Validators.minLength(10)]],
      wouldRecommend:    ['', Validators.required],
      overallExperience: ['', Validators.required]
    });
  }

  loadEligibleEnrollments(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.feedbackService.getEligibleEnrollments().subscribe({
      next: (res: any) => {
        this.enrollments = res.enrollments || [];
        this.isLoading   = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMyFeedback(): void {
    this.feedbackService.getMyFeedback().subscribe({
      next: (res: any) => {
        this.myFeedbacks = res.feedbacks || [];
        this.cdr.detectChanges();
      }
    });
  }

  selectEnrollment(enrollment: any): void {
    this.selectedEnrollment = enrollment;
    this.courseRating  = 0;
    this.trainerRating = 0;
    this.feedbackForm.reset();
    this.cdr.detectChanges();
  }

  setCourseRating(rating: number): void {
    this.courseRating = rating;
    this.feedbackForm.patchValue({ courseRating: rating });
    this.cdr.detectChanges();
  }

  setTrainerRating(rating: number): void {
    this.trainerRating = rating;
    this.feedbackForm.patchValue({ trainerRating: rating });
    this.cdr.detectChanges();
  }

  submitFeedback(): void {
    if (this.feedbackForm.invalid || !this.selectedEnrollment) return;

    this.isSubmitting = true;

    const data = {
      enrollmentId: this.selectedEnrollment._id,
      ...this.feedbackForm.value
    };

    this.feedbackService.submitFeedback(data).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.showSnackBar(res.message, 'success');
        this.selectedEnrollment = null;
        this.feedbackForm.reset();
        this.courseRating  = 0;
        this.trainerRating = 0;
        this.loadEligibleEnrollments();
        this.loadMyFeedback();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.showSnackBar(err.error?.message || 'Failed to submit feedback', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  cancelFeedback(): void {
    this.selectedEnrollment = null;
    this.feedbackForm.reset();
    this.courseRating  = 0;
    this.trainerRating = 0;
    this.cdr.detectChanges();
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }

  getExperienceColor(exp: string): string {
    const colors: any = {
      'Excellent': '#2e7d32',
      'Good':      '#1565c0',
      'Average':   '#e65100',
      'Poor':      '#c62828'
    };
    return colors[exp] || '#333';
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
