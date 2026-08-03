import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../auth/services/auth';
import { StatsService } from '../services/stats';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {

  @Input() role: string = '';
  activeRoute: string = '';
  pendingCount: number = 0;

  constructor(
    private authService: AuthService,
    private statsService: StatsService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.activeRoute = e.urlAfterRedirects;
    });
  }

  get user() { return this.authService.getUser(); }

  ngOnInit(): void {
    this.loadPendingCount();
  }

  loadPendingCount(): void {
    if (this.role === 'manager') {
      this.statsService.getManagerStats().subscribe({
        next: (res: any) => {
          this.pendingCount = res.pending || 0;
        }
      });
    }
    if (this.role === 'admin') {
      this.statsService.getAdminStats().subscribe({
        next: (res: any) => {
          this.pendingCount = res.pendingRequests || 0;
        }
      });
    }
  }

  get adminLinks() {
    return [
      { label: 'Dashboard',          icon: 'dashboard',       route: '/admin/dashboard' },
      { label: 'Manage Courses',     icon: 'menu_book',       route: '/admin/courses'   },
      { label: 'Manage Batches',     icon: 'group',           route: '/admin/batches'   },
      { label: 'Manage Users',       icon: 'manage_accounts', route: '/admin/users'     },
      { label: 'Course Calendar',    icon: 'calendar_month',  route: '/admin/calendar'  },
      { label: 'Enroll Participants',icon: 'how_to_reg',      route: '/admin/enroll',   badge: this.pendingCount },
      { label: 'View Reports',       icon: 'bar_chart',       route: '/admin/reports'   }
    ];
  }

  get managerLinks() {
    return [
      { label: 'Dashboard',        icon: 'dashboard',       route: '/manager/dashboard' },
      { label: 'Pending Requests', icon: 'pending_actions', route: '/manager/requests', badge: this.pendingCount },
      { label: 'View Batches',     icon: 'group',           route: '/manager/batches'  },
      { label: 'Course Calendar',  icon: 'calendar_month',  route: '/manager/calendar' }
    ];
  }

  get employeeLinks() {
    return [
      { label: 'Dashboard',       icon: 'dashboard',      route: '/employee/dashboard'  },
      { label: 'Browse Courses',  icon: 'menu_book',      route: '/employee/courses'    },
      { label: 'My Enrollments',  icon: 'school',         route: '/employee/enrollments'},
      { label: 'Course Calendar', icon: 'calendar_month', route: '/employee/calendar'   },
      { label: 'Give Feedback',   icon: 'rate_review',    route: '/employee/feedback'   }
    ];
  }

  get links() {
    if (this.role === 'admin')   return this.adminLinks;
    if (this.role === 'manager') return this.managerLinks;
    return this.employeeLinks;
  }

  get roleColor() {
    const colors: any = {
      admin:    'linear-gradient(135deg, #2d1b69, #4a2c8a)',
      manager:  'linear-gradient(135deg, #00695c, #00897b)',
      employee: 'linear-gradient(135deg, #4a148c, #880e4f)'
    };
    return colors[this.role] || colors.admin;
  }

  isActive(route: string): boolean {
    return this.activeRoute === route ||
           this.activeRoute.startsWith(route + '/');
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
