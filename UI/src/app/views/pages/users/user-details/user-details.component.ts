import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { UserService, User } from '../../../../core/services/user.service';
import { DateFormatService } from '../../../../core/services/date-format.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FeatherIconDirective,
    TranslateModule
  ],
  template: `
    <div class="page-content">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
          <h4 class="mb-3 mb-md-0">{{ 'USERS.USER_DETAILS' | translate }}</h4>
          <nav class="page-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/users/list">{{ 'NAVBAR.USERS' | translate }}</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{ user?.displayName || ('USERS.USER_DETAILS' | translate) }}</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex align-items-center flex-wrap text-nowrap">
          <a routerLink="/users/list" class="btn btn-outline-secondary btn-icon-text me-2 mb-2 mb-md-0">
            <i class="feather icon-arrow-left btn-icon-prepend" appFeatherIcon></i>
            {{ 'USERS.BACK_TO_LIST' | translate }}
          </a>
          <a [routerLink]="['/users/edit', user.id]" class="btn btn-primary btn-icon-text mb-2 mb-md-0" *ngIf="user">
            <i class="feather icon-edit btn-icon-prepend" appFeatherIcon></i>
            {{ 'USERS.EDIT_USER' | translate }}
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" *ngIf="loading">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ 'COMMON.LOADING' | translate }}...</span>
          </div>
          <p class="mt-3 text-muted">{{ 'USERS.LOADING_USER_DETAILS' | translate }}...</p>
        </div>
      </div>

      <!-- Error State -->
      <div class="row" *ngIf="error && !loading">
        <div class="col-12">
          <div class="alert alert-danger d-flex align-items-center" role="alert">
            <i class="feather icon-alert-triangle me-2" appFeatherIcon></i>
            <div>
              <strong>{{ 'COMMON.ERROR' | translate }}!</strong> {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- User Details Content -->
      <div class="row" *ngIf="user && !loading">
        <!-- Profile Card -->
        <div class="col-12 mb-4">
          <div class="card profile-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="avatar avatar-lg me-3">
                  <div class="avatar-title bg-primary text-white rounded-circle">
                    {{ getInitials(user.firstName, user.lastName) }}
                  </div>
                </div>
                <div class="flex-grow-1">
                  <h5 class="mb-1">{{ user.displayName }}</h5>
                  <p class="text-muted mb-2">{{ user.email }}</p>
                  <div class="d-flex align-items-center">
                    <span class="badge me-2" [class]="user.isActive ? 'bg-success' : 'bg-secondary'">
                      <i class="feather me-1" [attr.data-feather]="user.isActive ? 'check-circle' : 'x-circle'" appFeatherIcon></i>
                      {{ user.isActive ? ('USERS.ACTIVE' | translate) : ('USERS.INACTIVE' | translate) }}
                    </span>
                    <small class="text-muted">{{ 'USERS.FIELDS.USER_ID' | translate }}: #{{ user.id }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-user me-2" appFeatherIcon></i>
                {{ 'USERS.PERSONAL_INFORMATION' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.TITLE' | translate }}</label>
                    <p class="mb-0">{{ user.title || ('COMMON.NOT_SPECIFIED' | translate) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.FIRST_NAME' | translate }}</label>
                    <p class="mb-0">{{ user.firstName }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.MIDDLE_NAME' | translate }}</label>
                    <p class="mb-0">{{ user.middleName || ('COMMON.NOT_SPECIFIED' | translate) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.LAST_NAME' | translate }}</label>
                    <p class="mb-0">{{ user.lastName }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.DISPLAY_NAME' | translate }}</label>
                    <p class="mb-0">{{ user.displayName }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.DATE_OF_BIRTH' | translate }}</label>
                    <p class="mb-0">{{ formatDate(user.dateOfBirth, 'shortDate') }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.MARITAL_STATUS' | translate }}</label>
                    <p class="mb-0">{{ user.maritalStatus || ('COMMON.NOT_SPECIFIED' | translate) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.USERNAME' | translate }}</label>
                    <p class="mb-0">{{ user.username }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.EMAIL' | translate }}</label>
                    <p class="mb-0">
                      <a [href]="'mailto:' + user.email" class="text-decoration-none">
                        {{ user.email }}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-phone me-2" appFeatherIcon></i>
                {{ 'USERS.CONTACT_INFORMATION' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.FIRST_ADDRESS' | translate }}</label>
                    <p class="mb-0">{{ user.firstAddress || ('COMMON.NOT_SPECIFIED' | translate) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.SECOND_ADDRESS' | translate }}</label>
                    <p class="mb-0">{{ user.secondAddress || ('COMMON.NOT_SPECIFIED' | translate) }}</p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.POSTAL_CODE' | translate }}</label>
                    <p class="mb-0">{{ user.postalCode || ('COMMON.NOT_SPECIFIED' | translate) }}</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.MOBILE_NUMBER' | translate }}</label>
                    <p class="mb-0">
                      <span *ngIf="user.mobileNumber">
                        <a [href]="'tel:' + user.mobileNumber" class="text-decoration-none">
                          {{ user.mobileNumber }}
                        </a>
                      </span>
                      <span *ngIf="!user.mobileNumber" class="text-muted">{{ 'COMMON.NOT_SPECIFIED' | translate }}</span>
                    </p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.WORK_NUMBER' | translate }}</label>
                    <p class="mb-0">
                      <span *ngIf="user.workNumber">
                        <a [href]="'tel:' + user.workNumber" class="text-decoration-none">
                          {{ user.workNumber }}
                        </a>
                      </span>
                      <span *ngIf="!user.workNumber" class="text-muted">{{ 'COMMON.NOT_SPECIFIED' | translate }}</span>
                    </p>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.HOME_NUMBER' | translate }}</label>
                    <p class="mb-0">
                      <span *ngIf="user.homeNumber">
                        <a [href]="'tel:' + user.homeNumber" class="text-decoration-none">
                          {{ user.homeNumber }}
                        </a>
                      </span>
                      <span *ngIf="!user.homeNumber" class="text-muted">{{ 'COMMON.NOT_SPECIFIED' | translate }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Information -->
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-info me-2" appFeatherIcon></i>
                {{ 'USERS.SYSTEM_INFORMATION' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.ACCOUNT_STATUS' | translate }}</label>
                    <div>
                      <span class="badge fs-6 px-3 py-2" [class]="user.isActive ? 'bg-success' : 'bg-secondary'">
                        <i class="feather me-1" [attr.data-feather]="user.isActive ? 'check-circle' : 'x-circle'" appFeatherIcon></i>
                        {{ user.isActive ? ('USERS.ACTIVE' | translate) : ('USERS.INACTIVE' | translate) }}
                      </span>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.CREATED_DATE' | translate }}</label>
                    <p class="mb-0">{{ formatDate(user.createdAt, 'short') }}</p>
                    <small class="text-muted">{{ formatTimeAgo(user.createdAt) }}</small>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.LAST_UPDATED' | translate }}</label>
                    <p class="mb-0">{{ formatDate(user.updatedAt, 'short') }}</p>
                    <small class="text-muted">{{ formatTimeAgo(user.updatedAt) }}</small>
                  </div>
                  <div class="mb-3">
                    <label class="form-label text-muted">{{ 'USERS.FIELDS.USER_ID' | translate }}</label>
                    <p class="mb-0 font-monospace">#{{ user.id }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Roles & Permissions -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-shield me-2" appFeatherIcon></i>
                {{ 'USERS.ROLES_PERMISSIONS' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div *ngIf="user.rolesAndPermissions && user.rolesAndPermissions.length > 0">
                <div class="mb-3" *ngFor="let role of user.rolesAndPermissions; let i = index">
                  <div class="d-flex align-items-center justify-content-between">
                    <span class="badge bg-primary fs-6 px-3 py-2">
                      <i class="feather icon-user-check me-1" appFeatherIcon></i>
                      {{ role.name }}
                    </span>
                  </div>
                  <div class="mt-2" *ngIf="role.permissions && role.permissions.length > 0">
                    <small class="text-muted d-block mb-1">{{ 'USERS.PERMISSIONS' | translate }}:</small>
                    <div class="d-flex flex-wrap gap-1">
                      <span
                        class="badge bg-light text-dark border"
                        *ngFor="let permission of role.permissions"
                        [title]="permission.group">
                        {{ permission.name }}
                      </span>
                    </div>
                  </div>
                  <hr *ngIf="i < user.rolesAndPermissions.length - 1" class="my-3">
                </div>
              </div>
              <div *ngIf="!user.rolesAndPermissions || user.rolesAndPermissions.length === 0" class="text-center py-3">
                <i class="feather icon-user-x text-muted mb-2" appFeatherIcon style="font-size: 2rem;"></i>
                <p class="text-muted mb-0">{{ 'USERS.NO_ROLES_ASSIGNED' | translate }}</p>
                <small class="text-muted">{{ 'USERS.CONTACT_ADMIN_ROLES' | translate }}</small>
              </div>
            </div>
          </div>

          <!-- Authorities -->
          <div class="card" *ngIf="user.authorities && user.authorities.length > 0">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-key me-2" appFeatherIcon></i>
                {{ 'USERS.AUTHORITIES' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                <span
                  class="badge bg-warning text-dark fs-6 px-3 py-2"
                  *ngFor="let authority of user.authorities">
                  {{ authority.authority }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mt-4">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-zap me-2" appFeatherIcon></i>
                {{ 'USERS.QUICK_ACTIONS' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <a [routerLink]="['/users/edit', user.id]" class="btn btn-outline-primary btn-sm">
                  <i class="feather icon-edit me-2" appFeatherIcon></i>
                  {{ 'USERS.EDIT_USER' | translate }}
                </a>
                <button
                  class="btn btn-sm"
                  [class]="user.isActive ? 'btn-outline-warning' : 'btn-outline-success'"
                  (click)="toggleUserStatus()">
                  <i class="feather me-2"
                     [attr.data-feather]="user.isActive ? 'user-minus' : 'user-plus'"
                     appFeatherIcon></i>
                  {{ user.isActive ? ('USERS.DEACTIVATE' | translate) : ('USERS.ACTIVATE' | translate) }} {{ 'USERS.USER' | translate }}
                </button>
                <button class="btn btn-outline-info btn-sm" (click)="sendPasswordReset()">
                  <i class="feather icon-mail me-2" appFeatherIcon></i>
                  {{ 'USERS.SEND_PASSWORD_RESET' | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dateFormatService: DateFormatService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadUser(+id);
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.error = '';

    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.user = user;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.error = 'Failed to load user details. Please try again.';
        console.error('Error loading user:', error);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last;
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string | null | undefined, format: string = 'medium'): string {
    return this.dateFormatService.formatForDisplay(dateString, format);
  }

  /**
   * Format time ago string
   */
  formatTimeAgo(dateString: string | null | undefined): string {
    return this.dateFormatService.getTimeAgo(dateString);
  }

  /**
   * @deprecated Use formatTimeAgo instead
   */
  getTimeAgo(dateString: string): string {
    return this.dateFormatService.getTimeAgo(dateString);
  }

  toggleUserStatus(): void {
    if (!this.user) return;

    const action = this.user.isActive ? 'deactivate' : 'activate';
    const actionTitle = this.user.isActive ? 'Deactivate User' : 'Activate User';
    const confirmText = `Are you sure you want to ${action} ${this.user.displayName}?`;
    const buttonText = this.user.isActive ? 'Deactivate' : 'Activate';
    const buttonColor = this.user.isActive ? '#d33' : '#3085d6';

    Swal.fire({
      title: actionTitle,
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: buttonColor,
      cancelButtonColor: '#6c757d',
      confirmButtonText: buttonText,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUser = { ...this.user!, isActive: !this.user!.isActive };

        this.userService.updateUser(this.user!.id, updatedUser).subscribe({
          next: (user: User) => {
            this.user = user;
            Swal.fire({
              title: 'Success!',
              text: `User ${action}d successfully!`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error: any) => {
            console.error(`Error ${action}ing user:`, error);
            Swal.fire({
              title: 'Error!',
              text: `Failed to ${action} user. Please try again.`,
              icon: 'error',
              confirmButtonColor: '#3085d6'
            });
          }
        });
      }
    });
  }

  sendPasswordReset(): void {
    if (!this.user) return;

    Swal.fire({
      title: 'Send Password Reset?',
      text: `This will send a password reset email to ${this.user.email}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // This would typically call a password reset API endpoint
        // For now, we'll just show a success message
        Swal.fire({
          title: 'Email Sent!',
          text: `Password reset email has been sent to ${this.user!.email}`,
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });

        // TODO: Implement actual password reset API call
        // this.userService.sendPasswordReset(this.user.email).subscribe({
        //   next: () => {
        //     Swal.fire({
        //       title: 'Email Sent!',
        //       text: `Password reset email has been sent to ${this.user!.email}`,
        //       icon: 'success',
        //       timer: 3000,
        //       showConfirmButton: false
        //     });
        //   },
        //   error: (error: any) => {
        //     console.error('Error sending password reset:', error);
        //     Swal.fire({
        //       title: 'Error!',
        //       text: 'Failed to send password reset email. Please try again.',
        //       icon: 'error',
        //       confirmButtonColor: '#3085d6'
        //     });
        //   }
        // });
      }
    });
  }
}
