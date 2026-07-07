import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeaveRecord, LeaveService } from '../../services/leaveService';

interface EmployeeSummary {
  name: string;
  department: string;
  pending: number;
  approved: number;
  rejected: number;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {
  displayedColumns = ['name', 'department', 'pending', 'approved', 'rejected'];
  employees: EmployeeSummary[] = [];
  isLoading = true;

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.leaveService.getLeaveRecords().subscribe({
      next: (res) => {
        this.employees = this.buildSummary(res.data || []);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private buildSummary(records: LeaveRecord[]): EmployeeSummary[] {
    const map = new Map<string, EmployeeSummary>();

    for (const record of records) {
      const id = record.employeeId._id;
      if (!map.has(id)) {
        map.set(id, {
          name: `${record.employeeId.firstName} ${record.employeeId.lastName}`,
          department: record.employeeId.department,
          pending: 0,
          approved: 0,
          rejected: 0,
        });
      }
      const entry = map.get(id)!;
      if (record.status === 'Pending') entry.pending++;
      else if (record.status === 'Approved') entry.approved++;
      else if (record.status === 'Rejected') entry.rejected++;
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }
}
