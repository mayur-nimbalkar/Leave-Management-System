import { Component, OnInit, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported if using [(ngModel)] in template
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LeaveRecord, LeaveService } from '../../services/leaveService';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Added for template-driven filter bindings if needed
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.css',
})
export class MyLeaves implements OnInit {
  private leaveService = inject(LeaveService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  displayedColumns = ['leaveType', 'dates', 'duration', 'reason', 'status'];
  leaves: LeaveRecord[] = [];
  filteredLeaves: LeaveRecord[] = [];
  isLoading = true;
  statusFilter = 'all';

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.isLoading = true;

    this.leaveService
      .getLeaveRecords()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.leaves = res.data || [];
          this.applyFilter();
          this.isLoading = false;

          // Force UI repaint in case of zone updates or loading lags
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load leave records', err);
          this.leaves = [];
          this.filteredLeaves = [];
          this.isLoading = false;

          // Dismiss the loading spinner even if the request fails
          this.cdr.detectChanges();
        },
      });
  }

  onFilterChange(): void {
    this.applyFilter();
    // Force table refresh when dropdown changes filter values manually
    this.cdr.detectChanges();
  }

  private applyFilter(): void {
    // Normalizing strings to lowercase prevents subtle casing issues with backend strings
    const filterValue = this.statusFilter.toLowerCase();

    this.filteredLeaves =
      filterValue === 'all'
        ? this.leaves
        : this.leaves.filter((l) => l.status.toLowerCase() === filterValue);
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  statusClass(status: string): string {
    if (!status) return 'status-unknown';
    return `status-${status.toLowerCase()}`;
  }
}
