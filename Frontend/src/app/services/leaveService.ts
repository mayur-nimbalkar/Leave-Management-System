import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LeaveRecord {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  employeeId: {
    _id: string;
    firstName: string;
    lastName: string;
    department: string;
  };
  approverId?: {
    firstName: string;
    lastName: string;
  };
}

export interface LeaveBalance {
  CL: number;
  SL: number;
  EL: number;
  compOff: number;
  year: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/leaves`;

  constructor(private http: HttpClient) {}

  applyLeave(data: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Observable<ApiResponse<LeaveRecord>> {
    return this.http.post<ApiResponse<LeaveRecord>>(`${this.apiUrl}/apply`, data);
  }

  getLeaveRecords(params?: {
    status?: string;
    employeeId?: string;
  }): Observable<ApiResponse<LeaveRecord[]>> {
    let httpParams = new HttpParams();
    if (params?.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params?.employeeId) {
      httpParams = httpParams.set('employeeId', params.employeeId);
    }
    return this.http.get<ApiResponse<LeaveRecord[]>>(`${this.apiUrl}/records/`, {
      params: httpParams,
    });
  }

  updateLeaveStatus(data: {
    _id: string;
    status: 'Approved' | 'Rejected';
    rejectionReason?: string;
  }): Observable<ApiResponse<LeaveRecord>> {
    return this.http.patch<ApiResponse<LeaveRecord>>(`${this.apiUrl}/update`, data);
  }

  getLeaveBalance(): Observable<ApiResponse<LeaveBalance>> {
    return this.http.get<ApiResponse<LeaveBalance>>(`${this.apiUrl}/balance`);
  }
}
