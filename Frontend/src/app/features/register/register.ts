import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { AuthService } from '../../services/authService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ...AngularMaterials, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  departments = ['it', 'hr', 'finance', 'marketing'];
  roles = [
    { value: 'staff', label: 'Staff' },
    { value: 'hod', label: 'Head of Department' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required),
      department: new FormControl('', Validators.required),
      role: new FormControl('staff', Validators.required),
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) return 'Password is required';
    if (passwordControl?.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const formValues = this.registerForm.value;

    const userData = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      phone: formValues.phone,
      password: formValues.password,
      department: formValues.department,
      role: formValues.role,
    };

    this.authService.registerUser(userData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.snackBar.open('Registration successful! Redirecting...', 'Close', { duration: 3000 });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error: any) => {
        this.isSubmitting = false;
        console.error('Registration failed:', error);
        const errorMessage = error.error?.message || 'Registration failed. Please try again.';
        if (errorMessage.includes('email')) {
          this.registerForm.get('email')?.setErrors({ emailExists: true });
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      },
    });
  }
}
