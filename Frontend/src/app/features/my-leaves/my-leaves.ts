import { finalize } from 'rxjs/operators';
import {
  Component,
  OnInit,
  DestroyRef,
  inject,
  signal,
  computed,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LeaveRecord, LeaveService } from '../../services/leaveService';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  isLoading = true;

  leavesSignal = signal<LeaveRecord[]>([]);
  statusFilterSignal = signal<string>('all');

  filteredLeaves = computed(() => {
    const leaves = this.leavesSignal();
    const filter = this.statusFilterSignal().toLowerCase();

    if (filter === 'all') {
      return leaves;
    }
    return leaves.filter((l) => l.status?.toLowerCase() === filter);
  });

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.isLoading = true;

    this.leaveService
      .getLeaveRecords()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          this.leavesSignal.set(res.data || []);
        },
        error: (err) => {
          console.error('Failed to load leave records', err);
          this.leavesSignal.set([]);
        },
      });
  }

  onFilterChange(newValue: string): void {
    this.statusFilterSignal.set(newValue);
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
