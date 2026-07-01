import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { LeaveService } from '../../services/leaveService';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [CommonModule, ...AngularMaterials, MatSnackBarModule],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.css',
})
export class MyLeaves implements OnInit {
  leaves: any[] = [];
  isLoading = true;
  filter = 'all';

  constructor(private leaveService: LeaveService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.isLoading = true;
    this.leaveService.getLeaveRecords(this.filter === 'all' ? '' : this.filter).subscribe({
      next: (res: any) => {
        this.leaves = res?.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Unable to load your leave history.', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  applyFilter(value: string): void {
    this.filter = value;
    this.loadLeaves();
  }
}
