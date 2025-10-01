import { NgStyle, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, RegisterRequest, RegisterResponse, ApiErrorResponse } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Initialize the form
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      agreeTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    // Redirect to home if already logged in
    if (this.authService.isLoggedInValue) {
      this.router.navigate(['/']);
    }

    // Pre-fill email if coming from login page
    const emailFromQuery = this.route.snapshot.queryParams['email'];
    if (emailFromQuery) {
      this.registerForm.patchValue({
        email: emailFromQuery
      });
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onRegister(e: Event) {
    e.preventDefault();

    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const userData: RegisterRequest = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.register(userData).subscribe({
      next: (response: RegisterResponse) => {
        this.loading = false;
        if (response.success && response.data?.token) {
          // Store user info for navbar display
          const userInfo = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`,
            // Add more user info from response if available
            ...response.data.user
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));

          // Registration successful
          this.success = response.message || 'Registration successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          // Registration failed
          this.error = response.message || 'Registration failed. Please try again.';
        }
      },
      error: (error: any) => {
        this.loading = false;

        // Handle different API error response formats
        if (error.error) {
          // Handle new standardized API error response format
          if (error.error.success === false && error.error.message) {
            this.error = error.error.message;
            // Handle specific error codes
            if (error.error.errorCode === 'EMAIL_ALREADY_EXISTS') {
              this.error = 'Email already exists. Please use a different email or try logging in.';
            }
          }
          // Handle HTTP error response format (400, 409, etc.) - fallback
          else if (error.status) {
            switch (error.status) {
              case 400:
                this.error = 'Invalid registration data. Please check your information.';
                break;
              case 409:
                this.error = 'Email already exists. Please use a different email or try logging in.';
                break;
              case 422:
                this.error = 'Invalid data format. Please check all fields.';
                break;
              default:
                this.error = error.error.message || 'Registration failed. Please try again.';
            }
          }
          // Handle legacy error formats
          else if (error.error.message) {
            this.error = error.error.message;
          }
          // Fallback to HTTP status text
          else {
            this.error = error.error.error || error.statusText || 'An error occurred during registration. Please try again.';
          }
        } else if (error.message) {
          this.error = error.message;
        } else {
          this.error = 'An error occurred during registration. Please try again.';
        }
        console.error('Registration error:', error);
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

}
