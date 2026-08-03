import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth-guard';
import { RoleGuard } from './auth/guards/role-guard';
import { LoginGuard } from './auth/guards/login-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login').then(m => m.LoginComponent),
    canActivate: [LoginGuard]
  },

  // ── ADMIN ──────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/shell/shell').then(m => m.ShellComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./admin/courses/course-list/course-list').then(m => m.CourseListComponent)
      },
      {
        path: 'batches',
        loadComponent: () =>
          import('./admin/batches/batch-list/batch-list').then(m => m.BatchListComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/users/user-list/user-list').then(m => m.UserListComponent)
      },
      {
        path: 'enroll',
        loadComponent: () =>
          import('./admin/enrollments/enrol-participants/enroll-participants')
            .then(m => m.EnrollParticipantsComponent)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./shared/calendar/calendar').then(m => m.CalendarComponent)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./admin/reports/reports/reports').then(m => m.ReportsComponent)
      },
    ]
  },

  // ── MANAGER ────────────────────────────────────────
  {
    path: 'manager',
    loadComponent: () =>
      import('./manager/shell/shell').then(m => m.ShellComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['manager'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./manager/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'requests',
        loadComponent: () =>
          import('./manager/requests/enrolment-requests/enrollment-requests')
            .then(m => m.EnrollmentRequestsComponent)
      },
      {
        path: 'batches',
        loadComponent: () =>
          import('./manager/batches/view-batches/view-batches')
            .then(m => m.ViewBatchesComponent)  // ← must be this
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./shared/calendar/calendar').then(m => m.CalendarComponent)
      }
    ]
  },

  // ── EMPLOYEE ───────────────────────────────────────
  {
    path: 'employee',
    loadComponent: () =>
      import('./employee/shell/shell').then(m => m.ShellComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['employee'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./employee/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./employee/courses/browse-courses/browse-courses')
            .then(m => m.BrowseCoursesComponent)
      },
      {
        path: 'enrollments',
        loadComponent: () =>
          import('./employee/enrollments/my-enrolments/my-enrollments')
            .then(m => m.MyEnrollmentsComponent)
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./shared/calendar/calendar').then(m => m.CalendarComponent)
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('./employee/feedback/feedback/feedback').then(m => m.FeedbackComponent)
      },
    ]
  },

  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found')
        .then(m => m.NotFoundComponent)
  }
];