import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // Get allowed roles from route data
    const allowedRoles = route.data['roles'] as string[];

    // Get current user role
    const userRole = this.authService.getRole();

    // Check if user is logged in first
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Check if user's role is allowed
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // Wrong role → redirect to their own dashboard
    this.redirectToDashboard(userRole);
    return false;
  }

  private redirectToDashboard(role: string): void {
    const dashboards: any = {
      admin:    '/admin/dashboard',
      manager:  '/manager/dashboard',
      employee: '/employee/dashboard'
    };
    this.router.navigate([dashboards[role] || '/auth/login']);
  }
}