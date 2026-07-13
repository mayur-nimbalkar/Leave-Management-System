export type UserRole = 'hod' | 'staff';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  department: string;
  role: UserRole;
}

export interface LeaveRecord {
  _id: string;
  leaveType: string;
  duration: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
  employeeId?: Partial<User>;
  approverId?: Partial<User>;
  approvalDate?: string;
  rejectionReason?: string;
}

export interface LeaveBalance {
  CL: number;
  SL: number;
  EL: number;
  CompOff: number;
}
