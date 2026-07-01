import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly apiUrl = `${environment.apiUrl}/leaves`;

  constructor(private readonly http: HttpClient) {}

  getLeaveRecords(status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get(`${this.apiUrl}/records`, { params });
  }

  getLeaveBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/balance`);
  }

  getLeaveStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }

  applyLeave(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/apply`, payload);
  }

  updateLeaveStatus(payload: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update`, payload);
  }
}
