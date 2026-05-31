import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5500/api/auth';

  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/register', userData);
  }
}
