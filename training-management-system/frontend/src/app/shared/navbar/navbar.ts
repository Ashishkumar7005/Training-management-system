import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  @Input() role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get user() {
    return this.authService.getUser();
  }

  get roleLabel() {
    const labels: any = {
      admin: 'Administrator',
      manager: 'Manager',
      employee: 'Employee'
    };
    return labels[this.role] || this.role;
  }

  get roleColor() {
    const colors: any = {
      admin: '#6c3fc5',
      manager: '#00897b',
      employee: '#880e4f'
    };
    return colors[this.role] || '#333';
  }

  logout() {
    this.authService.logout();
  }
}