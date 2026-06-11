// import { Component } from '@angular/core';
// import { AngularMaterials } from '../../shared/AngularMaterial';
// @Component({
//   selector: 'app-login-user',
//   imports: [...AngularMaterials],
//   templateUrl: './login-user.html',
//   styleUrl: './login-user.css',
// })
// export class  {}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { AuthService } from '../../services/authService';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-user',
  imports: [...AngularMaterials, ReactiveFormsModule, RouterModule],
  templateUrl: './login-user.html',
  styleUrl: './login-user.css',
})
export class LoginUser implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    console.log('Logging in with:', this.loginForm.value);

    this.authService.loginUser(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);

        // Save the JWT token or user session data
        localStorage.setItem('token', response.token);

        alert('Welcome back!');
        this.router.navigate(['/dashboard']); // Redirect to your app home/dashboard
      },
      error: (err: any) => {
        console.error('Login failed:', err);
        const errorMessage = err.error?.message || 'Invalid email or password.';
        alert(errorMessage);
      },
    });
  }
}
