import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { LeaveService } from '../../services/leaveService';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ...AngularMaterials, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.css',
})
export class ApplyLeave implements OnInit {
  leaveForm!: FormGroup;
  isSubmitting = false;
  leaveTypes = ['CL', 'SL', 'EL', 'CompOff'];

  constructor(
    private leaveService: LeaveService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.leaveForm = new FormGroup({
      leaveType: new FormControl('CL', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      reason: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.snackBar.open('Please complete the form before submitting.', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    this.leaveService.applyLeave(this.leaveForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Leave request submitted successfully.', 'Close', { duration: 3000 });
        this.router.navigate(['/my-leaves']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.snackBar.open(err.error?.message || 'Unable to submit your leave request.', 'Close', { duration: 3000 });
      },
    });
  }
}
