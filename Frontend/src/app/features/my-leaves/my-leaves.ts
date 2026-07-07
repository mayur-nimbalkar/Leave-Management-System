import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LeaveRecord, LeaveService } from '../../services/leaveService';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [
    CommonModule,
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
  displayedColumns = ['leaveType', 'dates', 'duration', 'reason', 'status'];
  leaves: LeaveRecord[] = [];
  filteredLeaves: LeaveRecord[] = [];
  isLoading = true;
  statusFilter = 'all';

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.isLoading = true;
    this.leaveService.getLeaveRecords().subscribe({
      next: (res) => {
        this.leaves = res.data || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredLeaves =
      this.statusFilter === 'all'
        ? this.leaves
        : this.leaves.filter((l) => l.status === this.statusFilter);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  statusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
