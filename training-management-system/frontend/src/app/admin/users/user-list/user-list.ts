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
// import { NavbarComponent } from '../../../shared/navbar/navbar';
import { UserService } from '../services/user';
import { UserFormComponent } from '../user-form/user-form';
import { MatDivider } from '@angular/material/divider';
@Component({
  selector: 'app-user-list',
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
    MatDivider
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  searchText = '';
  selectedRole = 'all';

  roles = [
    { value: 'all',      label: 'All Users'  },
    { value: 'admin',    label: 'Admins'     },
    { value: 'manager',  label: 'Managers'   },
    { value: 'employee', label: 'Employees'  }
  ];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showSnackBar('Failed to load users', 'error');
      }
    });
  }

  applyFilter(): void {
  let filtered = [...this.users];

  if (this.selectedRole !== 'all') {
    filtered = filtered.filter(u => u.role === this.selectedRole);
  }

  if (this.searchText) {
    const text = this.searchText.toLowerCase();
    filtered = filtered.filter(u =>
      u.firstName?.toLowerCase().includes(text)  ||
      u.lastName?.toLowerCase().includes(text)   ||
      u.username?.toLowerCase().includes(text)   ||
      u.email?.toLowerCase().includes(text)      ||
      u.employeeId?.toLowerCase().includes(text) // ← add this
    );
  }

  this.filteredUsers = filtered;
  this.cdr.detectChanges();
}

  onSearch(): void { this.applyFilter(); }
  onRoleFilter(role: string): void {
    this.selectedRole = role;
    this.applyFilter();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '560px',
      maxHeight: '90vh',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  openEditDialog(user: any): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '560px',
      maxHeight: '90vh',
      data: { mode: 'edit', user }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  deleteUser(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.showSnackBar('User deleted successfully', 'success');
          this.loadUsers();
        },
        error: (err) => this.showSnackBar(
          err.error?.message || 'Failed to delete user', 'error'
        )
      });
    }
  }

  toggleStatus(user: any): void {
    this.userService.toggleStatus(user._id).subscribe({
      next: (res) => {
        this.showSnackBar(res.message, 'success');
        this.loadUsers();
      },
      error: (err) => this.showSnackBar(
        err.error?.message || 'Failed to update status', 'error'
      )
    });
  }

  getRoleColor(role: string): string {
    const colors: any = {
      admin:    '#6c3fc5',
      manager:  '#00897b',
      employee: '#880e4f'
    };
    return colors[role] || '#333';
  }

  getInitials(user: any): string {
    return `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();
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