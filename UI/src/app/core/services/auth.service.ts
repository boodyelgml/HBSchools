import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user?: any;
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  timestamp: string;
  path?: string;
}

export interface HttpErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user?: any;
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/v1/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  /**
   * Authenticate user with email and password
   */
  authenticate(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/authenticate`, credentials)
      .pipe(
        tap(response => {
          // Only set token if response is successful and contains a token
          if (response && response.success && response.data?.token) {
            this.setToken(response.data.token, response.data.user);
            this.isLoggedInSubject.next(true);
          }
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          // Set token if registration is successful
          if (response && response.success && response.data?.token) {
            this.setToken(response.data.token, response.data.user);
            this.isLoggedInSubject.next(true);
          }
        })
      );
  }

  /**
   * Check if user is logged in
   */
  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * Get current login status
   */
  get isLoggedInValue(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Store authentication token and user info
   */
  private setToken(token: string, userInfo?: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('isLoggedin', 'true');

    // Store user info if provided
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if token exists
   */
  private hasToken(): boolean {
    return !!this.getToken() && localStorage.getItem('isLoggedin') === 'true';
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('userInfo');
    this.isLoggedInSubject.next(false);
  }
}
