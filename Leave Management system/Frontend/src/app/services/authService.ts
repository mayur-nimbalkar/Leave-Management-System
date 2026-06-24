import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5500/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated = signal<boolean>(this.isLoggedIn());
  public userRole = signal<'hod' | 'staff' | null>(this.getUserRole());

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  registerUser(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
          this.userRole.set(response.user.role);
        }
      })
    );
  }

  loginUser(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.isAuthenticated.set(true);
          this.userRole.set(response.user.role);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.userRole.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): 'hod' | 'staff' | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
        this.userRole.set(user.role);
      } catch (e) {
        console.error('Error loading user from storage:', e);
      }
    }
  }
}
