import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AngularMaterials } from '../../shared/AngularMaterial';

@Component({
  selector: 'app-register',
  imports: [...AngularMaterials, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;
  showPassword = false;
  ngOnInit() {
    this.registerForm = new FormGroup({
      role: new FormControl('staff'),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', Validators.required),
      departmentName: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);
  }
}
