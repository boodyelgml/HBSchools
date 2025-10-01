import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp: string;
  path?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  timestamp: string;
  path?: string;
}

export interface UserAuthority {
  authority: string;
}

export interface UserPermission {
  id: number;
  group: string;
  name: string;
  isActive: boolean;
}

export interface UserRole {
  id: number;
  name: string;
  permissions: UserPermission[];
}

export interface User {
  id: number;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: string;
  maritalStatus: string;
  firstAddress: string;
  secondAddress: string;
  postalCode: string;
  mobileNumber: string;
  workNumber: string;
  homeNumber: string;
  username: string;
  email: string;
  accountStatus: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  authorities: UserAuthority[];
  rolesAndPermissions: UserRole[];
}

export interface UpdateUserRequest {
  id: number;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  displayName: string;
  dateOfBirth: string;
  maritalStatus: string;
  firstAddress: string;
  secondAddress: string;
  postalCode: string;
  mobileNumber: string;
  workNumber: string;
  homeNumber: string;
  username: string;
  email: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9090/api/v1/auth';

  constructor(private http: HttpClient) {}

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/user/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Create new user
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/users`, user)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Update user using the new API endpoint
   */
  updateUser(id: number, user: Partial<User>): Observable<User> {
    const updateRequest: UpdateUserRequest = {
      id: id,
      title: user.title || '',
      firstName: user.firstName || '',
      middleName: user.middleName || '',
      lastName: user.lastName || '',
      displayName: user.displayName || '',
      dateOfBirth: user.dateOfBirth || new Date().toISOString(),
      maritalStatus: user.maritalStatus || '',
      firstAddress: user.firstAddress || '',
      secondAddress: user.secondAddress || '',
      postalCode: user.postalCode || '',
      mobileNumber: user.mobileNumber || '',
      workNumber: user.workNumber || '',
      homeNumber: user.homeNumber || '',
      username: user.username || '',
      email: user.email || '',
      isActive: user.isActive !== undefined ? user.isActive : true
    };

    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/user/update`, updateRequest)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Update user with UpdateUserRequest object directly
   */
  updateUserDirect(updateRequest: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/user/update`, updateRequest)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/users/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(id: number): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/users/${id}/toggle-status`, {})
      .pipe(
        map(response => response.data)
      );
  }
}
