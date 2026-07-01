import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { AuthService } from '../../services/authService';
import { LeaveService } from '../../services/leaveService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ...AngularMaterials],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user: any = null;
  stats: any = null;
  balance: any = null;
  isLoading = true;

  constructor(private authService: AuthService, private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.leaveService.getLeaveStatistics().subscribe({
      next: (res: any) => {
        this.stats = res?.data ?? { total: 0, pending: 0, approved: 0, rejected: 0 };
      },
      error: () => {
        this.stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
      },
    });

    this.leaveService.getLeaveBalance().subscribe({
      next: (res: any) => {
        this.balance = res?.data ?? { CL: 0, SL: 0, EL: 0, CompOff: 0 };
        this.isLoading = false;
      },
      error: () => {
        this.balance = { CL: 0, SL: 0, EL: 0, CompOff: 0 };
        this.isLoading = false;
      },
    });
  }
}
