import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Imported DatePipe
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { LeaveService } from '../../services/leaveService';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...AngularMaterials, MatSnackBarModule],
  providers: [DatePipe], // Provided DatePipe for safe formatting
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.css',
})
export class ApplyLeave implements OnInit {
  // Using modern inject syntax
  private leaveService = inject(LeaveService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private datePipe = inject(DatePipe);
  private destroyRef = inject(DestroyRef);

  leaveForm!: FormGroup;
  isSubmitting = false;

  leaveTypes = [
    { value: 'CL', label: 'Casual Leave (CL)' },
    { value: 'SL', label: 'Sick Leave (SL)' },
    { value: 'EL', label: 'Earned Leave (EL)' },
    { value: 'CompOff', label: 'Compensatory Off' },
  ];

  ngOnInit(): void {
    this.leaveForm = new FormGroup({
      leaveType: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      reason: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const { leaveType, startDate, endDate, reason } = this.leaveForm.value;

    // Quick validation check: Ensure start date isn't after end date
    if (new Date(startDate) > new Date(endDate)) {
      this.snackBar.open('Start date cannot be after End date', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    this.leaveService
      .applyLeave({
        leaveType,
        startDate: this.formatDate(startDate),
        endDate: this.formatDate(endDate),
        reason,
      })
      .pipe(takeUntilDestroyed(this.destroyRef)) // Protect against slow-network leaks if user leaves page
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('Leave application submitted!', 'Close', { duration: 3000 });
          this.router.navigate(['/my-leaves']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.snackBar.open(err.error?.message || 'Failed to submit leave', 'Close', {
            duration: 4000,
          });
        },
      });
  }

  /**
   * Safe date formatting that respects the user's local date selection
   * rather than forcing a UTC conversion which shifts dates backward.
   */
  private formatDate(date: any): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
