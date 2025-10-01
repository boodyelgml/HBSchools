import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { UserService, User, UserRole, UpdateUserRequest } from '../../../../core/services/user.service';
import { DateFormatService } from '../../../../core/services/date-format.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FeatherIconDirective, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="page-content">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
          <h4 class="mb-3 mb-md-0">{{ isEditMode ? ('USERS.EDIT_USER' | translate) : ('USERS.ADD_NEW_USER' | translate) }}</h4>
          <nav class="page-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/users/list">{{ 'NAVBAR.USERS' | translate }}</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ isEditMode ? ('USERS.EDIT_USER' | translate) : ('USERS.ADD_USER' | translate) }}
              </li>
            </ol>
          </nav>
        </div>
        <div class="d-flex align-items-center flex-wrap text-nowrap">
          <a routerLink="/users/list" class="btn btn-outline-secondary btn-icon-text me-2 mb-2 mb-md-0">
            <i class="feather icon-arrow-left btn-icon-prepend" appFeatherIcon></i>
            {{ 'USERS.BACK_TO_LIST' | translate }}
          </a>
          <a
            *ngIf="isEditMode && userId"
            [routerLink]="['/users/view', userId]"
            class="btn btn-outline-info btn-icon-text mb-2 mb-md-0">
            <i class="feather icon-eye btn-icon-prepend" appFeatherIcon></i>
            {{ 'USERS.VIEW_DETAILS' | translate }}
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" *ngIf="loading">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ 'COMMON.LOADING' | translate }}...</span>
          </div>
          <p class="mt-3 text-muted">{{ isEditMode ? ('USERS.FORM.LOADING_USER_DATA' | translate) : ('USERS.FORM.PREPARING_FORM' | translate) }}</p>
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

      <!-- Form Content -->
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
        <div class="row">
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
                      <label for="title" class="form-label">{{ 'USERS.FIELDS.TITLE' | translate }}</label>
                      <select
                        id="title"
                        class="form-select"
                        formControlName="title"
                        [class.is-invalid]="isFieldInvalid('title')">
                        <option value="">{{ 'USERS.FORM.SELECT_TITLE' | translate }}</option>
                        <option value="Mr">{{ 'USERS.FORM.TITLE_MR' | translate }}</option>
                        <option value="Mrs">{{ 'USERS.FORM.TITLE_MRS' | translate }}</option>
                        <option value="Ms">{{ 'USERS.FORM.TITLE_MS' | translate }}</option>
                        <option value="Dr">{{ 'USERS.FORM.TITLE_DR' | translate }}</option>
                        <option value="Prof">{{ 'USERS.FORM.TITLE_PROF' | translate }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="maritalStatus" class="form-label">{{ 'USERS.FIELDS.MARITAL_STATUS' | translate }}</label>
                      <select
                        id="maritalStatus"
                        class="form-select"
                        formControlName="maritalStatus"
                        [class.is-invalid]="isFieldInvalid('maritalStatus')">
                        <option value="">{{ 'USERS.FORM.SELECT_STATUS' | translate }}</option>
                        <option value="Single">{{ 'USERS.FORM.SINGLE' | translate }}</option>
                        <option value="Married">{{ 'USERS.FORM.MARRIED' | translate }}</option>
                        <option value="Divorced">{{ 'USERS.FORM.DIVORCED' | translate }}</option>
                        <option value="Widowed">{{ 'USERS.FORM.WIDOWED' | translate }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label for="firstName" class="form-label">
                        {{ 'USERS.FIELDS.FIRST_NAME' | translate }} <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        class="form-control"
                        formControlName="firstName"
                        [class.is-invalid]="isFieldInvalid('firstName')"
                        placeholder="{{ 'USERS.FORM.ENTER_FIRST_NAME' | translate }}">
                      <div class="invalid-feedback" *ngIf="isFieldInvalid('firstName')">
                        {{ 'USERS.FORM.VALIDATION.FIRST_NAME_REQUIRED' | translate }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label for="middleName" class="form-label">{{ 'USERS.FIELDS.MIDDLE_NAME' | translate }}</label>
                      <input
                        type="text"
                        id="middleName"
                        class="form-control"
                        formControlName="middleName"
                        placeholder="{{ 'USERS.FORM.ENTER_MIDDLE_NAME' | translate }}">
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label for="lastName" class="form-label">
                        {{ 'USERS.FIELDS.LAST_NAME' | translate }} <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        class="form-control"
                        formControlName="lastName"
                        [class.is-invalid]="isFieldInvalid('lastName')"
                        placeholder="{{ 'USERS.FORM.ENTER_LAST_NAME' | translate }}">
                      <div class="invalid-feedback" *ngIf="isFieldInvalid('lastName')">
                        {{ 'USERS.FORM.VALIDATION.LAST_NAME_REQUIRED' | translate }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="displayName" class="form-label">
                        {{ 'USERS.FIELDS.DISPLAY_NAME' | translate }} <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        class="form-control"
                        formControlName="displayName"
                        [class.is-invalid]="isFieldInvalid('displayName')"
                        placeholder="{{ 'USERS.FORM.ENTER_DISPLAY_NAME' | translate }}">
                      <div class="invalid-feedback" *ngIf="isFieldInvalid('displayName')">
                        {{ 'USERS.FORM.VALIDATION.DISPLAY_NAME_REQUIRED' | translate }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="dateOfBirth" class="form-label">{{ 'USERS.FIELDS.DATE_OF_BIRTH' | translate }}</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        class="form-control"
                        formControlName="dateOfBirth">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="feather icon-lock me-2" appFeatherIcon></i>
                  {{ 'USERS.ACCOUNT_INFORMATION' | translate }}
                </h6>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="username" class="form-label">
                        {{ 'USERS.FIELDS.USERNAME' | translate }} <span class="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        class="form-control"
                        formControlName="username"
                        [class.is-invalid]="isFieldInvalid('username')"
                        placeholder="{{ 'USERS.FORM.ENTER_USERNAME' | translate }}">
                      <div class="invalid-feedback" *ngIf="isFieldInvalid('username')">
                        <div *ngIf="userForm.get('username')?.errors?.['required']">{{ 'USERS.FORM.VALIDATION.USERNAME_REQUIRED' | translate }}</div>
                        <div *ngIf="userForm.get('username')?.errors?.['minlength']">{{ 'USERS.FORM.VALIDATION.USERNAME_MIN_LENGTH' | translate }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="email" class="form-label">
                        {{ 'USERS.FIELDS.EMAIL' | translate }} <span class="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        class="form-control"
                        formControlName="email"
                        [class.is-invalid]="isFieldInvalid('email')"
                        placeholder="{{ 'USERS.FORM.ENTER_EMAIL' | translate }}">
                      <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                        <div *ngIf="userForm.get('email')?.errors?.['required']">{{ 'USERS.FORM.VALIDATION.EMAIL_REQUIRED' | translate }}</div>
                        <div *ngIf="userForm.get('email')?.errors?.['email']">{{ 'USERS.FORM.VALIDATION.EMAIL_INVALID' | translate }}</div>
                      </div>
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
                      <label for="firstAddress" class="form-label">{{ 'USERS.FIELDS.FIRST_ADDRESS' | translate }}</label>
                      <textarea
                        id="firstAddress"
                        class="form-control"
                        formControlName="firstAddress"
                        rows="3"
                        placeholder="{{ 'USERS.FORM.ENTER_PRIMARY_ADDRESS' | translate }}"></textarea>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="secondAddress" class="form-label">{{ 'USERS.FIELDS.SECOND_ADDRESS' | translate }}</label>
                      <textarea
                        id="secondAddress"
                        class="form-control"
                        formControlName="secondAddress"
                        rows="3"
                        placeholder="{{ 'USERS.FORM.ENTER_SECONDARY_ADDRESS' | translate }}"></textarea>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-3">
                    <div class="mb-3">
                      <label for="postalCode" class="form-label">{{ 'USERS.FIELDS.POSTAL_CODE' | translate }}</label>
                      <input
                        type="text"
                        id="postalCode"
                        class="form-control"
                        formControlName="postalCode"
                        placeholder="{{ 'USERS.FORM.ENTER_POSTAL_CODE' | translate }}">
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="mb-3">
                      <label for="mobileNumber" class="form-label">{{ 'USERS.FIELDS.MOBILE_NUMBER' | translate }}</label>
                      <input
                        type="tel"
                        id="mobileNumber"
                        class="form-control"
                        formControlName="mobileNumber"
                        placeholder="{{ 'USERS.FORM.ENTER_MOBILE_NUMBER' | translate }}">
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="mb-3">
                      <label for="workNumber" class="form-label">{{ 'USERS.FIELDS.WORK_NUMBER' | translate }}</label>
                      <input
                        type="tel"
                        id="workNumber"
                        class="form-control"
                        formControlName="workNumber"
                        placeholder="{{ 'USERS.FORM.ENTER_WORK_NUMBER' | translate }}">
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="mb-3">
                      <label for="homeNumber" class="form-label">{{ 'USERS.FIELDS.HOME_NUMBER' | translate }}</label>
                      <input
                        type="tel"
                        id="homeNumber"
                        class="form-control"
                        formControlName="homeNumber"
                        placeholder="{{ 'USERS.FORM.ENTER_HOME_NUMBER' | translate }}">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Status & Actions -->
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="feather icon-settings me-2" appFeatherIcon></i>
                  {{ 'USERS.STATUS_ACTIONS' | translate }}
                </h6>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label">{{ 'USERS.ACCOUNT_STATUS' | translate }}</label>
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="isActive"
                      formControlName="isActive">
                    <label class="form-check-label" for="isActive">
                      <span *ngIf="userForm.get('isActive')?.value; else inactiveLabel">
                        <i class="feather icon-check-circle text-success me-1" appFeatherIcon></i>
                        {{ 'USERS.ACTIVE' | translate }}
                      </span>
                      <ng-template #inactiveLabel>
                        <i class="feather icon-x-circle text-secondary me-1" appFeatherIcon></i>
                        {{ 'USERS.INACTIVE' | translate }}
                      </ng-template>
                    </label>
                  </div>
                  <small class="form-text text-muted">
                    {{ 'USERS.FORM.ACTIVE_USER_HELP' | translate }}
                  </small>
                </div>

                <div class="d-grid gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="userForm.invalid || submitting">
                    <i class="feather me-2"
                       [attr.data-feather]="submitting ? 'loader' : 'save'"
                       appFeatherIcon></i>
                    {{ submitting ? ('USERS.FORM.SAVING' | translate) : (isEditMode ? ('USERS.FORM.UPDATE_USER' | translate) : ('USERS.FORM.CREATE_USER' | translate)) }}
                  </button>

                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    (click)="onCancel()">
                    <i class="feather icon-x me-2" appFeatherIcon></i>
                    {{ 'USERS.FORM.CANCEL' | translate }}
                  </button>

                  <button
                    type="button"
                    class="btn btn-outline-warning"
                    (click)="onReset()"
                    *ngIf="!isEditMode">
                    <i class="feather icon-refresh-cw me-2" appFeatherIcon></i>
                    {{ 'USERS.FORM.RESET_FORM' | translate }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Roles Assignment (for edit mode) -->
            <div class="card" *ngIf="isEditMode && availableRoles.length > 0">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="feather icon-shield me-2" appFeatherIcon></i>
                  {{ 'USERS.ROLES_ASSIGNMENT' | translate }}
                </h6>
              </div>
              <div class="card-body">
                <div class="mb-3" *ngFor="let role of availableRoles">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      [id]="'role-' + role.id"
                      [checked]="isRoleSelected(role.id)"
                      (change)="onRoleChange(role.id, $event)">
                    <label class="form-check-label" [for]="'role-' + role.id">
                      {{ role.name }}
                    </label>
                  </div>
                </div>
                <div *ngIf="availableRoles.length === 0" class="text-muted text-center py-3">
                  <i class="feather icon-info" appFeatherIcon></i>
                  <p class="mb-0 mt-2">{{ 'USERS.NO_ROLES_AVAILABLE' | translate }}</p>
                </div>
              </div>
            </div>

            <!-- Form Help -->
            <div class="card">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="feather icon-help-circle me-2" appFeatherIcon></i>
                  {{ 'USERS.FORM.HELP_TIPS' | translate }}
                </h6>
              </div>
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li class="mb-2">
                    <i class="feather icon-check text-success me-2" appFeatherIcon></i>
                    <small>{{ 'USERS.FORM.HELP.REQUIRED_FIELDS' | translate }}</small>
                  </li>
                  <li class="mb-2">
                    <i class="feather icon-check text-success me-2" appFeatherIcon></i>
                    <small>{{ 'USERS.FORM.HELP.USERNAME_LENGTH' | translate }}</small>
                  </li>
                  <li class="mb-2">
                    <i class="feather icon-check text-success me-2" appFeatherIcon></i>
                    <small>{{ 'USERS.FORM.HELP.EMAIL_FORMAT' | translate }}</small>
                  </li>
                  <li class="mb-0" *ngIf="!isEditMode">
                    <i class="feather icon-info text-info me-2" appFeatherIcon></i>
                    <small>{{ 'USERS.FORM.HELP.DEFAULT_PASSWORD' | translate }}</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  submitting = false;
  error = '';
  availableRoles: UserRole[] = [];
  selectedRoleIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dateFormatService: DateFormatService
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.loadUser(this.userId);
    }

    // Load available roles
    this.loadAvailableRoles();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: [''],
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      dateOfBirth: [''],
      firstAddress: [''],
      secondAddress: [''],
      mobileNumber: [''],
      workNumber: [''],
      homeNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      postalCode: [''],
      maritalStatus: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      isActive: [true]
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.error = '';

    this.userService.getUserById(id).subscribe({
      next: (user: User) => {
        this.populateForm(user);
        this.selectedRoleIds = user.rolesAndPermissions?.map(role => role.id) || [];
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.error = 'Failed to load user data. Please try again.';
        console.error('Error loading user:', error);
      }
    });
  }

  populateForm(user: User): void {
    this.userForm.patchValue({
      title: user.title || '',
      firstName: user.firstName || '',
      middleName: user.middleName || '',
      lastName: user.lastName || '',
      displayName: user.displayName || '',
      dateOfBirth: user.dateOfBirth ? this.formatDateForInput(user.dateOfBirth) : '',
      firstAddress: user.firstAddress || '',
      secondAddress: user.secondAddress || '',
      mobileNumber: user.mobileNumber || '',
      workNumber: user.workNumber || '',
      homeNumber: user.homeNumber || '',
      email: user.email || '',
      postalCode: user.postalCode || '',
      maritalStatus: user.maritalStatus || '',
      username: user.username || '',
      isActive: user.isActive
    });
  }

  loadAvailableRoles(): void {
    // This would typically call a roles service
    // For now, we'll use mock data
    this.availableRoles = [
      { id: 1, name: 'Administrator', permissions: [] },
      { id: 2, name: 'Teacher', permissions: [] },
      { id: 3, name: 'Student', permissions: [] },
      { id: 4, name: 'Parent', permissions: [] }
    ];
  }

  formatDateForInput(dateString: string): string {
    return this.dateFormatService.formatForInput(dateString);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  onRoleChange(roleId: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedRoleIds.includes(roleId)) {
        this.selectedRoleIds.push(roleId);
      }
    } else {
      this.selectedRoleIds = this.selectedRoleIds.filter(id => id !== roleId);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.submitting = true;

      const formData = this.userForm.value;

      // Format date for API (ISO 8601 format)
      const dateOfBirth = this.dateFormatService.formatForApi(formData.dateOfBirth);

      const userData = {
        ...formData,
        dateOfBirth: dateOfBirth,
        // Ensure ID is included for updates
        ...(this.isEditMode && { id: this.userId }),
        rolesAndPermissions: this.selectedRoleIds.map(id => ({ id }))
      };

      const operation = this.isEditMode
        ? this.userService.updateUser(this.userId!, userData)
        : this.userService.createUser(userData);

      operation.subscribe({
        next: (user: User) => {
          this.submitting = false;
          const message = this.isEditMode ? 'User updated successfully!' : 'User created successfully!';

          Swal.fire({
            title: 'Success!',
            text: message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/users/view', user.id]);
          });
        },
        error: (error: any) => {
          this.submitting = false;
          console.error('Error saving user:', error);

          Swal.fire({
            title: 'Error!',
            text: 'Failed to save user. Please try again.',
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    if (this.userForm.dirty) {
      Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, discard changes',
        cancelButtonText: 'No, keep editing'
      }).then((result) => {
        if (result.isConfirmed) {
          this.navigateBack();
        }
      });
    } else {
      this.navigateBack();
    }
  }

  onReset(): void {
    Swal.fire({
      title: 'Reset Form',
      text: 'This will clear all form data. Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reset form',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userForm.reset();
        this.userForm.patchValue({ isActive: true });
        this.selectedRoleIds = [];
      }
    });
  }

  private navigateBack(): void {
    if (this.isEditMode && this.userId) {
      this.router.navigate(['/users/view', this.userId]);
    } else {
      this.router.navigate(['/users/list']);
    }
  }
}
