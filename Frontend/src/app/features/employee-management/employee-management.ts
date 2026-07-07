import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterials } from '../../../shared/AngularMaterial';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, ...AngularMaterials],
  templateUrl: './employee-management.html',
  styleUrl: './employee-management.css',
})
export class EmployeeManagement implements OnInit {
  employees = [
    { name: 'Asha Rao', department: 'IT', role: 'Staff' },
    { name: 'Nikhil Shah', department: 'HR', role: 'HOD' },
  ];

  ngOnInit(): void {}
}
