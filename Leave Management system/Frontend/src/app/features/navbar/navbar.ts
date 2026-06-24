import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/authService';
import { AngularMaterials } from '../../../shared/AngularMaterial';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  isHOD(): boolean {
    return this.authService.userRole() === 'hod';
  }
}

