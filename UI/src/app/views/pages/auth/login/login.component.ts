import { NgStyle, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, LoginRequest, LoginResponse, ApiErrorResponse, HttpErrorResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: any;
  loading = false;
  error = '';
  showRegisterSuggestion = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Initialize the form
    this.loginForm = this.formBuilder.group({
      email: ['admin@demo.com', [Validators.required, Validators.email]],
      password: ['12345678', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Get the return URL from the route parameters, or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Redirect to home if already logged in
    if (this.authService.isLoggedInValue) {
      this.router.navigate([this.returnUrl]);
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onLoggedin(e: Event) {
    e.preventDefault();

    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.showRegisterSuggestion = false;

    const credentials: LoginRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.authenticate(credentials).subscribe({
      next: (response: LoginResponse) => {
        this.loading = false;
        if (response.success && response.data?.token) {
          // Store user info for navbar display
          const userInfo = {
            email: credentials.email,
            // Add more user info from response if available
            ...response.data.user
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          // Login successful
          this.router.navigate([this.returnUrl]);
        } else {
          // Login failed
          this.error = response.message || 'Login failed. Please try again.';
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.showRegisterSuggestion = false;

        // Handle different API error response formats
        if (error.error) {
          // Handle new standardized API error response format
          if (error.error.success === false && error.error.message) {
            this.error = error.error.message;
            // Check if user not found, suggest registration
            if (error.error.errorCode === 'NOT_FOUND' ||
                error.error.message.toLowerCase().includes('not found')) {
              this.showRegisterSuggestion = true;
            }
          }
          // Handle HTTP error response format (401, 403, etc.) - fallback
          else if (error.status) {
            switch (error.status) {
              case 401:
                this.error = 'Invalid email or password. Please check your credentials.';
                this.showRegisterSuggestion = true;
                break;
              case 403:
                this.error = 'Access forbidden. Please contact support.';
                break;
              case 404:
                this.error = 'User not found. Would you like to create a new account?';
                this.showRegisterSuggestion = true;
                break;
              default:
                this.error = error.error.message || 'Authentication failed. Please try again.';
            }
          }
          // Handle legacy error formats
          else if (error.error.message) {
            this.error = error.error.message;
          }
          // Fallback to HTTP status text
          else {
            this.error = error.error.error || error.statusText || 'An error occurred. Please try again.';
          }
        } else if (error.message) {
          this.error = error.message;
        } else {
          this.error = 'An error occurred. Please try again.';
        }
        console.error('Login error:', error);
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  redirectToRegister() {
    // Pre-fill the email in the register form
    const email = this.f['email'].value;
    this.router.navigate(['/auth/register'], {
      queryParams: { email: email }
    });
  }
}
