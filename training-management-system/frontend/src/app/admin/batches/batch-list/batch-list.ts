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
import { MatChipsModule } from '@angular/material/chips';
import { BatchService } from '../services/batch';
import { BatchFormComponent } from '../batch-form/batch-form';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-batch-list',
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
    MatChipsModule,
    MatDivider
  ],
  templateUrl: './batch-list.html',
  styleUrl: './batch-list.scss'
})
export class BatchListComponent implements OnInit {

  batches: any[] = [];
  filteredBatches: any[] = [];
  isLoading = true;
  searchText = '';

  constructor(
    private batchService: BatchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.batchService.getBatches().subscribe({
      next: (res: any) => {
        this.batches = res.batches || [];
        this.filteredBatches = res.batches || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showSnackBar('Failed to load batches', 'error');
      }
    });
  }

  onSearch(): void {
    const text = this.searchText.toLowerCase();
    this.filteredBatches = this.batches.filter(b =>
      b.batchName.toLowerCase().includes(text) ||
      b.batchCode.toLowerCase().includes(text) ||
      b.course?.courseName?.toLowerCase().includes(text)
    );
    this.cdr.detectChanges();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(BatchFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBatches();
    });
  }

  openEditDialog(batch: any): void {
    const dialogRef = this.dialog.open(BatchFormComponent, {
      width: '700px',
      maxHeight: '90vh',
      data: { mode: 'edit', batch }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBatches();
    });
  }

  deleteBatch(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.batchService.deleteBatch(id).subscribe({
        next: () => {
          this.showSnackBar('Batch deleted successfully', 'success');
          this.loadBatches();
        },
        error: () => this.showSnackBar('Failed to delete batch', 'error')
      });
    }
  }

  showSnackBar(message: string, type: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snack-success' : 'snack-error',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
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