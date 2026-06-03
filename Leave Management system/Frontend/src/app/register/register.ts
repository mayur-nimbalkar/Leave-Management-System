import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularMaterials } from '../../shared/AngularMaterial';
import { AuthService } from '../features/authService';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [...AngularMaterials, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;
  showPassword = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      role: new FormControl('Staff'),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    const formValues = this.registerForm.value;

    const userData = {
      role: formValues.role,
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      email: formValues.email,
      phone: formValues.phone,
      password: formValues.password,
      department: formValues.departmentName,
    };

    console.log(userData);

    this.authService.registerUser(userData).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.registerForm.reset({ role: 'Staff' });
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        const errorMessage = error.error?.message || 'Registration failed. Please try again.';
        if (errorMessage.includes('email')) {
          this.registerForm.get('email')?.setErrors({ emailExists: true });
        }
      },
    });
  }
}
