import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-batches',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './view-batches.html',
  styleUrl: './view-batches.scss'
})
export class ViewBatchesComponent implements OnInit {

  batches: any[] = [];
  filteredBatches: any[] = [];
  isLoading = true;
  searchText = '';

  constructor(
    private http: HttpClient,
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
        this.filteredBatches = res.batches || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredBatches = this.batches.filter(b =>
      b.batchName?.toLowerCase().includes(text) ||
      b.batchCode?.toLowerCase().includes(text) ||
      b.course?.courseName?.toLowerCase().includes(text)
    );
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

  getAvailableSpots(batch: any): number {
    return batch.maxParticipants - (batch.enrolledParticipants?.length || 0);
  }
}