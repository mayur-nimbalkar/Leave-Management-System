import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LeaveRecord, LeaveService } from '../../services/leaveService';
import { RejectDialog } from './reject-dialog';

@Component({
  selector: 'app-approve-leaves',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './approve-leaves.html',
  styleUrl: './approve-leaves.css',
})
export class ApproveLeaves implements OnInit {
  displayedColumns = ['employee', 'leaveType', 'dates', 'duration', 'reason', 'actions'];
  leaves: LeaveRecord[] = [];
  isLoading = true;
  processingId: string | null = null;

  constructor(
    private leaveService: LeaveService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadPendingLeaves();
  }

  loadPendingLeaves(): void {
    this.isLoading = true;
    this.leaveService.getLeaveRecords({ status: 'Pending' }).subscribe({
      next: (res) => {
        this.leaves = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  approve(leave: LeaveRecord): void {
    this.processingId = leave._id;
    this.leaveService.updateLeaveStatus({ _id: leave._id, status: 'Approved' }).subscribe({
      next: () => {
        this.processingId = null;
        this.snackBar.open('Leave approved', 'Close', { duration: 2000 });
        this.loadPendingLeaves();
      },
      error: (err) => {
        this.processingId = null;
        this.snackBar.open(err.error?.message || 'Failed to approve', 'Close', { duration: 3000 });
      },
    });
  }

  reject(leave: LeaveRecord): void {
    const dialogRef = this.dialog.open(RejectDialog, { width: '400px' });
    dialogRef.afterClosed().subscribe((reason: string) => {
      if (!reason) return;

      this.processingId = leave._id;
      this.leaveService
        .updateLeaveStatus({ _id: leave._id, status: 'Rejected', rejectionReason: reason })
        .subscribe({
          next: () => {
            this.processingId = null;
            this.snackBar.open('Leave rejected', 'Close', { duration: 2000 });
            this.loadPendingLeaves();
          },
          error: (err) => {
            this.processingId = null;
            this.snackBar.open(err.error?.message || 'Failed to reject', 'Close', {
              duration: 3000,
            });
          },
        });
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  employeeName(leave: LeaveRecord): string {
    return `${leave.employeeId.firstName} ${leave.employeeId.lastName}`;
  }
}
