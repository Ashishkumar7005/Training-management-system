import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFoundComponent implements OnInit {

  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  goHome(): void {
    const role = this.authService.getRole();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const dashboards: Record<string, string> = {
      admin: '/admin/dashboard',
      manager: '/manager/dashboard',
      employee: '/employee/dashboard'
    };

    this.router.navigate([dashboards[role] || '/auth/login']);
  }

  goLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    window.history.back();
  }
}
