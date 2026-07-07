import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/authService';
import { LeaveRecord, LeaveService } from '../../services/leaveService';
import { forkJoin } from 'rxjs'; // <-- Imported forkJoin to run APIs in parallel

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
    // forkJoin waits for BOTH API requests to complete before firing the subscription block
    forkJoin({
      balanceRes: this.leaveService.getLeaveBalance(),
      recordsRes: this.leaveService.getLeaveRecords(),
    }).subscribe({
      next: ({ balanceRes, recordsRes }) => {
        // 1. Assign Balance Data
        this.balance = balanceRes?.data || null;

        // 2. Process Records Data
        const records = recordsRes?.data || [];
        this.pendingCount = records.filter((r: LeaveRecord) => r.status === 'Pending').length;
        this.approvedCount = records.filter((r: LeaveRecord) => r.status === 'Approved').length;

        // 3. Turn off the loading state since all data is here
        this.isLoading = false;

        // CRITICAL FIX: Explicitly tell Angular to check for changes and repaint the UI.
        // This stops the dashboard from being stuck on the loader after a login redirect.
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard data fetch failed', err);
        this.balance = null;
        this.isLoading = false;

        // Force change detection on error as well, so the spinner disappears if the API fails
        this.cdr.detectChanges();
      },
    });
  }

  isHOD(): boolean {
    return this.authService.userRole() === 'hod';
  }
}
