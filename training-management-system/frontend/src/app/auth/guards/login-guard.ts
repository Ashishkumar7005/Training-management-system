import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true; // Not logged in → allow login page
    }

    // Already logged in → redirect to their dashboard
    const role = this.authService.getRole();
    const dashboards: any = {
      admin:    '/admin/dashboard',
      manager:  '/manager/dashboard',
      employee: '/employee/dashboard'
    };
    this.router.navigate([dashboards[role] || '/auth/login']);
    return false;
  }
}
