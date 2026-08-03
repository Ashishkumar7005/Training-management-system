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
import { UserService } from '../services/user';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserFormComponent implements OnInit {

  userForm!:   FormGroup;
  isLoading    = false;
  isEditMode   = false;
  hidePassword = true;
  managers:    any[] = [];

  roles       = ['manager', 'employee'];
  genders     = ['Male', 'Female', 'Other'];
  departments = ['HR', 'IT', 'Finance', 'Operations', 'Sales', 'Marketing'];
  statuses    = [
    { value: true,  label: 'Active'   },
    { value: false, label: 'Inactive' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = this.data.mode === 'edit';
    this.initForm();
    this.loadManagers();
    if (this.isEditMode) this.patchForm();
  }

  loadManagers(): void {
    this.userService.getManagers().subscribe({
      next: (res: any) => {
        this.managers = res.managers || [];
        this.cdr.detectChanges();
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      employeeId:  ['', Validators.required],
      firstName:   ['', Validators.required],
      lastName:    ['', Validators.required],
      age:         ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      gender:      ['', Validators.required],
      department:  ['', Validators.required],
      joiningDate: ['', Validators.required],
      location:    ['', Validators.required],
      username:    ['', [Validators.required, Validators.minLength(3)]],
      email:       ['', [Validators.required, Validators.email]],
      role:        ['employee', Validators.required],
      manager:     [''],
      password:    ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      isActive:    [true]
    });
  }

  patchForm(): void {
    const u = this.data.user;
    this.userForm.patchValue({
      employeeId:  u.employeeId,
      firstName:   u.firstName,
      lastName:    u.lastName,
      age:         u.age,
      gender:      u.gender,
      department:  u.department,
      joiningDate: u.joiningDate ? new Date(u.joiningDate) : '',
      location:    u.location,
      username:    u.username,
      email:       u.email,
      role:        u.role,
      manager:     u.manager?._id || u.manager || '',
      isActive:    u.isActive
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    const formData = { ...this.userForm.value };

    if (this.isEditMode && !formData.password) {
      delete formData.password;
    }

    // If manager field is empty string set to null
    if (!formData.manager) formData.manager = null;

    const action = this.isEditMode
      ? this.userService.updateUser(this.data.user._id, formData)
      : this.userService.createUser(formData);

    action.subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.snackBar.open(res.message, 'Close', {
          duration: 3000,
          panelClass: 'snack-success',
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.dialogRef.close(true);
      },
      error: (err: any) => {
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

  onCancel(): void { this.dialogRef.close(false); }

  hasError(field: string, error: string): boolean {
    const control = this.userForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }
}
