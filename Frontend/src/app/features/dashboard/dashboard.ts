import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/authService';
import { LeaveRecord, LeaveService } from '../../services/leaveService';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: any;
  balance: { CL: number; SL: number; EL: number; compOff: number } | null = null;
  pendingCount = 0;
  approvedCount = 0;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    forkJoin({
      balanceRes: this.leaveService.getLeaveBalance(),
      recordsRes: this.leaveService.getLeaveRecords(),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ balanceRes, recordsRes }) => {
          this.balance = balanceRes?.data || null;

          const records = recordsRes?.data || [];
          this.pendingCount = records.filter((r: LeaveRecord) => r.status === 'Pending').length;
          this.approvedCount = records.filter((r: LeaveRecord) => r.status === 'Approved').length;
        },
        error: (err) => {
          console.error('Dashboard data fetch failed', err);
          this.balance = null;
        },
      });
  }

  isHOD(): boolean {
    return this.authService.userRole() === 'hod';
  }
}
