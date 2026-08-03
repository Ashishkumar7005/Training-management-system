import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule,SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    SlicePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class CalendarComponent implements OnInit {

  currentDate  = new Date();
  currentMonth = new Date().getMonth();
  currentYear  = new Date().getFullYear();

  batches:         any[] = [];
  calendarDays:    any[] = [];
  selectedBatch:   any   = null;
  isLoading        = true;

  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.get('http://localhost:5000/api/batches').subscribe({
      next: (res: any) => {
        this.batches = res.batches || [];
        this.buildCalendar();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  buildCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    this.calendarDays = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      this.calendarDays.push({
        day:      daysInPrevMonth - i,
        current:  false,
        batches:  []
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.currentYear, this.currentMonth, d);
      const dayBatches = this.getBatchesForDay(date);

      this.calendarDays.push({
        day:      d,
        current:  true,
        today:    this.isToday(date),
        date:     date,
        batches:  dayBatches
      });
    }

    // Next month days to fill grid
    const remaining = 42 - this.calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      this.calendarDays.push({
        day:     i,
        current: false,
        batches: []
      });
    }

    this.cdr.detectChanges();
  }

  getBatchesForDay(date: Date): any[] {
    return this.batches.filter(b => {
      const start = new Date(b.startDate);
      const end   = new Date(b.endDate);
      const d     = new Date(date);

      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      d.setHours(12,0,0,0);

      return d >= start && d <= end;
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate()     === today.getDate() &&
           date.getMonth()    === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.selectedBatch = null;
    this.buildCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.selectedBatch = null;
    this.buildCalendar();
  }

  goToToday(): void {
    this.currentMonth = new Date().getMonth();
    this.currentYear  = new Date().getFullYear();
    this.selectedBatch = null;
    this.buildCalendar();
  }

  selectBatch(batch: any): void {
    this.selectedBatch = this.selectedBatch?._id === batch._id ? null : batch;
    this.cdr.detectChanges();
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'Upcoming':  '#1565c0',
      'Ongoing':   '#2e7d32',
      'Completed': '#6a1b9a',
      'Cancelled': '#c62828'
    };
    return colors[status] || '#333';
  }

  getMonthBatchCount(status: string): number {
  return this.batches.filter(b => {
    const start = new Date(b.startDate);
    return start.getMonth()    === this.currentMonth &&
           start.getFullYear() === this.currentYear  &&
           b.status            === status;
  }).length;
}

getMonthTotalBatches(): number {
  return this.batches.filter(b => {
    const start = new Date(b.startDate);
    return start.getMonth()    === this.currentMonth &&
           start.getFullYear() === this.currentYear;
  }).length;
}

getUpcomingBatches(): any[] {
  return this.batches.filter(b => {
    const start = new Date(b.startDate);
    return start.getMonth()    === this.currentMonth &&
           start.getFullYear() === this.currentYear  &&
           b.status            === 'Upcoming';
  }).sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

  get currentRole(): string {
    return this.authService.getRole();
  }
}