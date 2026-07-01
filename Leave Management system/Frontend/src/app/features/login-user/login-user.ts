import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { AuthService } from '../../services/authService';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [
    CommonModule,
    ...AngularMaterials,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './login-user.html',
  styleUrl: './login-user.css',
})
export class LoginUser implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Welcome back!', 'Close', { duration: 2000 });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 600);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Login failed:', err);
        const errorMessage = err.error?.message || 'Invalid email or password.';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      },
    });
  }
}
