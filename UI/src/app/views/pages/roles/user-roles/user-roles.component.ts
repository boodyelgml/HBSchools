import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { RoleService, Role, UserWithRoles, AttachRolesToUserRequest } from '../../../../core/services/role.service';
import { UserService, User } from '../../../../core/services/user.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FeatherIconDirective, TranslateModule, LoadingSkeletonComponent],
  template: `
    <div class="page-content">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
          <h4 class="mb-3 mb-md-0">{{ 'USER_ROLES.ASSIGN_ROLES' | translate }}</h4>
          <nav class="page-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/users/list">{{ 'NAVBAR.USERS' | translate }}</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{ 'USER_ROLES.ASSIGN_ROLES' | translate }}</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex align-items-center flex-wrap text-nowrap">
          <a routerLink="/users/list" class="btn btn-outline-secondary btn-icon-text me-2 mb-2 mb-md-0">
            <i class="feather icon-arrow-left btn-icon-prepend" appFeatherIcon></i>
            {{ 'USER_ROLES.BACK_TO_USERS' | translate }}
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" *ngIf="loading">
        <div class="col-lg-4">
          <app-loading-skeleton type="card" [lines]="4"></app-loading-skeleton>
        </div>
        <div class="col-lg-8">
          <app-loading-skeleton type="card" [lines]="6"></app-loading-skeleton>
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

      <!-- Content -->
      <div class="row" *ngIf="!loading">
        <!-- User Selection -->
        <div class="col-lg-4">
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-user me-2" appFeatherIcon></i>
                {{ 'USER_ROLES.SELECT_USER' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <form [formGroup]="userRoleForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="userId" class="form-label">
                    {{ 'USER_ROLES.USER' | translate }} <span class="text-danger">*</span>
                  </label>
                  <select
                    id="userId"
                    class="form-select"
                    formControlName="userId"
                    [class.is-invalid]="isFieldInvalid('userId')"
                    (change)="onUserChange()">
                    <option value="">{{ 'USER_ROLES.SELECT_USER_OPTION' | translate }}</option>
                    <option
                      *ngFor="let user of users; trackBy: trackByUserId"
                      [value]="user.id">
                      {{ user.displayName || (user.firstName + ' ' + user.lastName) }}
                    </option>
                  </select>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('userId')">
                    {{ 'USER_ROLES.VALIDATION.USER_REQUIRED' | translate }}
                  </div>
                </div>

                <!-- Selected User Info -->
                <div class="card bg-light" *ngIf="selectedUser">
                  <div class="card-body">
                    <div class="d-flex align-items-center mb-2">
                      <i class="feather icon-user text-primary me-2" appFeatherIcon></i>
                      <strong>{{ selectedUser.displayName || (selectedUser.firstName + ' ' + selectedUser.lastName) }}</strong>
                    </div>
                    <small class="text-muted">{{ 'USER_ROLES.EMAIL' | translate }}: {{ selectedUser.email }}</small><br>
                    <small class="text-muted">{{ 'USER_ROLES.USERNAME' | translate }}: {{ selectedUser.username }}</small>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Current User Roles -->
          <div class="card" *ngIf="selectedUser && currentUserRoles.length > 0">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-shield me-2" appFeatherIcon></i>
                {{ 'USER_ROLES.CURRENT_ROLES' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                <span
                  *ngFor="let role of currentUserRoles"
                  class="badge bg-success">
                  {{ role.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Role Assignment -->
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-settings me-2" appFeatherIcon></i>
                {{ 'USER_ROLES.ASSIGN_ROLES_TO_USER' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div *ngIf="!selectedUser" class="text-center py-5">
                <i class="feather icon-user-plus display-4 text-muted mb-3" appFeatherIcon></i>
                <h6 class="text-muted">{{ 'USER_ROLES.SELECT_USER_FIRST' | translate }}</h6>
                <p class="text-muted">{{ 'USER_ROLES.SELECT_USER_HELP' | translate }}</p>
              </div>

              <div *ngIf="selectedUser && !loading">
                <!-- Available Roles -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6>{{ 'USER_ROLES.AVAILABLE_ROLES' | translate }}</h6>
                    <div>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-primary me-2"
                        (click)="selectAllRoles()">
                        {{ 'USER_ROLES.SELECT_ALL' | translate }}
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        (click)="clearAllRoles()">
                        {{ 'USER_ROLES.CLEAR_ALL' | translate }}
                      </button>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6" *ngFor="let role of availableRoles; trackBy: trackByRoleId">
                      <div class="card border mb-3">
                        <div class="card-body">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              [id]="'role-' + role.id"
                              [checked]="isRoleSelected(role.id)"
                              (change)="toggleRole(role.id, $event)">
                            <label class="form-check-label" [for]="'role-' + role.id">
                              <div class="d-flex align-items-center">
                                <i class="feather icon-shield text-primary me-2" appFeatherIcon></i>
                                <div>
                                  <strong>{{ role.name }}</strong>
                                  <small class="d-block text-muted">
                                    {{ (role.permissions && role.permissions.length) || 0 }} {{ 'USER_ROLES.PERMISSIONS' | translate }}
                                  </small>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No Roles Available -->
                  <div class="text-center py-4" *ngIf="availableRoles.length === 0">
                    <i class="feather icon-shield display-4 text-muted mb-3" appFeatherIcon></i>
                    <h6 class="text-muted">{{ 'USER_ROLES.NO_ROLES_AVAILABLE' | translate }}</h6>
                    <p class="text-muted">{{ 'USER_ROLES.NO_ROLES_MESSAGE' | translate }}</p>
                    <a routerLink="/roles/add" class="btn btn-primary">
                      <i class="feather icon-plus me-2" appFeatherIcon></i>
                      {{ 'USER_ROLES.CREATE_ROLE' | translate }}
                    </a>
                  </div>
                </div>

                <!-- Selected Roles Summary -->
                <div class="card bg-light" *ngIf="selectedRoleIds.length > 0">
                  <div class="card-body">
                    <h6 class="mb-3">{{ 'USER_ROLES.SELECTED_ROLES' | translate }} ({{ selectedRoleIds.length }})</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span
                        *ngFor="let roleId of selectedRoleIds"
                        class="badge bg-primary d-flex align-items-center">
                        {{ getRoleName(roleId) }}
                        <button
                          type="button"
                          class="btn-close btn-close-white ms-1"
                          aria-label="Remove"
                          (click)="removeRole(roleId)">
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    (click)="resetForm()">
                    <i class="feather icon-refresh-cw me-2" appFeatherIcon></i>
                    {{ 'USER_ROLES.RESET' | translate }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    [disabled]="!selectedUser || selectedRoleIds.length === 0 || saving"
                    (click)="assignRoles()">
                    <span *ngIf="saving; else assignText">
                      <i class="feather icon-loader me-2" appFeatherIcon></i>
                      {{ 'USER_ROLES.ASSIGNING' | translate }}...
                    </span>
                    <ng-template #assignText>
                      <i class="feather icon-check me-2" appFeatherIcon></i>
                      {{ 'USER_ROLES.ASSIGN_ROLES' | translate }}
                    </ng-template>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserRolesComponent implements OnInit {
  userRoleForm: FormGroup;
  users: User[] = [];
  availableRoles: Role[] = [];
  currentUserRoles: any[] = [];
  selectedUser: User | null = null;
  selectedRoleIds: number[] = [];
  loading = false;
  saving = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService,
    private errorHandler: ErrorHandlerService,
    private validationService: ValidationService
  ) {
    this.userRoleForm = this.fb.group({
      userId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.userService.getAllUsers().toPromise(),
      this.roleService.getRoles().toPromise()
    ]).then(([usersData, rolesData]) => {
      this.users = usersData || [];
      this.availableRoles = rolesData || [];
      this.loading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.error = 'Failed to load data. Please try again.';
      this.loading = false;
    });
  }

  onUserChange(): void {
    const userId = this.userRoleForm.get('userId')?.value;
    if (userId) {
      this.selectedUser = this.users.find(u => u.id === parseInt(userId)) || null;
      this.loadUserRoles(parseInt(userId));
    } else {
      this.selectedUser = null;
      this.currentUserRoles = [];
    }
    this.selectedRoleIds = [];
  }

  loadUserRoles(userId: number): void {
    this.roleService.getUsersWithRoles().subscribe({
      next: (usersWithRoles) => {
        const userWithRoles = usersWithRoles.find(u => u.id === userId);
        this.currentUserRoles = userWithRoles ? userWithRoles.rolesAndPermissions : [];
      },
      error: (error) => {
        console.error('Error loading user roles:', error);
        this.currentUserRoles = [];
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userRoleForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  toggleRole(roleId: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedRoleIds.includes(roleId)) {
        this.selectedRoleIds.push(roleId);
      }
    } else {
      this.selectedRoleIds = this.selectedRoleIds.filter(id => id !== roleId);
    }
  }

  selectAllRoles(): void {
    this.selectedRoleIds = this.availableRoles.map(role => role.id);
  }

  clearAllRoles(): void {
    this.selectedRoleIds = [];
  }

  removeRole(roleId: number): void {
    this.selectedRoleIds = this.selectedRoleIds.filter(id => id !== roleId);
  }

  getRoleName(roleId: number): string {
    const role = this.availableRoles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  }

  resetForm(): void {
    this.userRoleForm.reset();
    this.selectedUser = null;
    this.currentUserRoles = [];
    this.selectedRoleIds = [];
  }

  assignRoles(): void {
    if (!this.selectedUser) {
      this.errorHandler.showError(
        'Validation Error',
        'Please select a user first.'
      );
      return;
    }

    if (this.selectedRoleIds.length === 0) {
      this.errorHandler.showError(
        'Validation Error',
        'Please select at least one role to assign.'
      );
      return;
    }

    // Validate user ID
    if (!this.validationService.isValidId(this.selectedUser.id)) {
      this.errorHandler.showError(
        'Validation Error',
        'Invalid user ID.'
      );
      return;
    }

    // Validate role IDs
    const invalidRoleIds = this.selectedRoleIds.filter(id => !this.validationService.isValidId(id));
    if (invalidRoleIds.length > 0) {
      this.errorHandler.showError(
        'Validation Error',
        'Invalid role IDs detected.'
      );
      return;
    }

    // Check for security threats in role IDs
    if (this.validationService.containsSqlInjection(this.selectedRoleIds.join(',')) ||
        this.validationService.containsXss(this.selectedRoleIds.join(','))) {
      this.errorHandler.showError(
        'Security Error',
        'Invalid data detected. Please try again.'
      );
      return;
    }

    this.saving = true;
    this.error = null;

    const request: AttachRolesToUserRequest = {
      userId: this.selectedUser.id,
      rolesList: this.selectedRoleIds
    };

    this.roleService.attachRolesToUser(request).subscribe({
      next: (response: any) => {
        this.saving = false;
        this.errorHandler.showSuccessMessage(
          'Success!',
          'Roles assigned successfully.'
        );
        this.loadUserRoles(this.selectedUser!.id); // Refresh user roles
      },
      error: (error: any) => {
        console.error('Error assigning roles:', error);
        this.saving = false;
        this.errorHandler.showError(
          'Error!',
          'Failed to assign roles. Please try again.'
        );
      }
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  trackByRoleId(index: number, role: Role): number {
    return role.id;
  }

  onSubmit(): void {
    // This method is called by the form, but we handle submission via assignRoles()
  }
}
