import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseService } from '../services/course';
import { CourseFormComponent } from '../course-form/course-form';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseListComponent implements OnInit {

  courses: any[] = [];
  filteredCourses: any[] = [];
  isLoading: boolean = true;
  searchText: string = '';

  constructor(
    private courseService: CourseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Component loaded');
    this.loadCourses();
  }

  loadCourses(): void {
    console.log('loadCourses called');
    this.isLoading = true;
    this.cdr.detectChanges();

    this.courseService.getCourses().subscribe({
      next: (res: any) => {
        console.log('SUCCESS:', res);
        this.courses = res.courses || [];
        this.filteredCourses = res.courses || [];
        this.isLoading = false;
        this.cdr.detectChanges(); // ← force Angular to update the view
      },
      error: (err: any) => {
        console.log('ERROR:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showSnackBar('Failed to load courses', 'error');
      }
    });
  }

  onSearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredCourses = this.courses.filter(c =>
      c.courseName.toLowerCase().includes(text) ||
      c.courseCode.toLowerCase().includes(text) ||
      c.trainerName.toLowerCase().includes(text) ||
      c.category.toLowerCase().includes(text)
    );
    this.cdr.detectChanges();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCourses();
    });
  }

  openEditDialog(course: any): void {
    const dialogRef = this.dialog.open(CourseFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { mode: 'edit', course }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadCourses();
    });
  }

  deleteCourse(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.showSnackBar('Course deleted successfully', 'success');
          this.loadCourses();
        },
        error: () => this.showSnackBar('Failed to delete course', 'error')
      });
    }
  }

  showSnackBar(message: string, type: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  getCategoryColor(category: string): string {
    return category === 'Technical' ? '#1565c0' : '#6a1b9a';
  }

  getModeColor(mode: string): string {
    const colors: any = {
      'Online':  '#2e7d32',
      'Offline': '#e65100',
      'Hybrid':  '#00838f'
    };
    return colors[mode] || '#333';
  }
}