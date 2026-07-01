import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { LeaveService } from '../../services/leaveService';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-approve-leaves',
  standalone: true,
  imports: [CommonModule, ...AngularMaterials, MatSnackBarModule],
  templateUrl: './approve-leaves.html',
  styleUrl: './approve-leaves.css',
})
export class ApproveLeaves implements OnInit {
  leaves: any[] = [];
  isLoading = true;

  constructor(private leaveService: LeaveService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.isLoading = true;
    this.leaveService.getLeaveRecords('Pending').subscribe({
      next: (res: any) => {
        this.leaves = res?.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Unable to load pending requests.', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  decide(leave: any, decision: 'Approved' | 'Rejected'): void {
    this.leaveService.updateLeaveStatus({ _id: leave._id, status: decision, rejectionReason: decision === 'Rejected' ? 'Not enough justification' : undefined }).subscribe({
      next: () => {
        this.snackBar.open(`Leave ${decision.toLowerCase()} successfully.`, 'Close', { duration: 3000 });
        this.loadLeaves();
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Unable to update the leave request.', 'Close', { duration: 3000 });
      },
    });
  }
}
