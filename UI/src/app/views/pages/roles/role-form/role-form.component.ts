import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { RoleService, TreeNode, CreateRoleRequest, UpdateRoleNameRequest, UpdateRoleRequest, Role } from '../../../../core/services/role.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { KeyboardNavigationService } from '../../../../core/services/keyboard-navigation.service';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FeatherIconDirective, TranslateModule, LoadingSkeletonComponent],
  template: `
    <div class="page-content" (keydown)="onGlobalKeydown($event)">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
          <h4 class="mb-3 mb-md-0">{{ isEditMode ? ('ROLES.EDIT_ROLE' | translate) : ('ROLES.ADD_NEW_ROLE' | translate) }}</h4>
          <nav class="page-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/roles/list">{{ 'ROLES.TITLE' | translate }}</a></li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ isEditMode ? ('ROLES.EDIT_ROLE' | translate) : ('ROLES.ADD_ROLE' | translate) }}
              </li>
            </ol>
          </nav>
        </div>
        <div class="d-flex align-items-center flex-wrap text-nowrap">
          <a routerLink="/roles/list" class="btn btn-outline-secondary btn-icon-text me-2 mb-2 mb-md-0">
            <i class="feather icon-arrow-left btn-icon-prepend" appFeatherIcon></i>
            {{ 'ROLES.BACK_TO_LIST' | translate }}
          </a>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div *ngIf="loading" class="row">
        <div class="col-md-12">
          <app-loading-skeleton type="form" [fields]="2"></app-loading-skeleton>
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
      <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" (keydown)="onFormKeydown($event)" *ngIf="!loading" role="form" [attr.aria-label]="isEditMode ? ('ROLES.EDIT_ROLE' | translate) : ('ROLES.ADD_NEW_ROLE' | translate)">
        <div class="row">
          <!-- Role Information -->
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="card-title mb-0" id="role-info-heading">
                  <i class="feather icon-shield me-2" appFeatherIcon></i>
                  {{ 'ROLES.ROLE_INFORMATION' | translate }}
                </h6>
              </div>
              <div class="card-body" role="group" aria-labelledby="role-info-heading">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="name" class="form-label">
                        {{ 'ROLES.FIELDS.NAME' | translate }} <span class="text-danger" aria-label="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        class="form-control"
                        formControlName="name"
                        [class.is-invalid]="isFieldInvalid('name')"
                        placeholder="{{ 'ROLES.FORM.ENTER_ROLE_NAME' | translate }}"
                        aria-required="true"
                        aria-describedby="name-error name-help"
                        [attr.aria-invalid]="isFieldInvalid('name')">
                      <div id="name-error" class="invalid-feedback" *ngIf="isFieldInvalid('name')" role="alert" aria-live="polite">
                        {{ getRoleNameErrorMessage() }}
                      </div>
                      <div id="name-help" class="text-info small mt-1" *ngIf="roleForm.get('name')?.pending" aria-live="polite">
                        <i class="feather icon-loader me-1" appFeatherIcon></i>
                        Checking name availability...
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="isActive" class="form-label">{{ 'ROLES.FIELDS.STATUS' | translate }}</label>
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="isActive"
                          formControlName="isActive"
                          role="switch"
                          [attr.aria-checked]="roleForm.get('isActive')?.value"
                          aria-describedby="status-description">
                        <label class="form-check-label" for="isActive">
                          <span *ngIf="roleForm.get('isActive')?.value; else inactiveLabel">
                            {{ 'ROLES.ACTIVE' | translate }}
                          </span>
                          <ng-template #inactiveLabel>
                            {{ 'ROLES.INACTIVE' | translate }}
                          </ng-template>
                        </label>
                        <div id="status-description" class="visually-hidden">
                          Toggle to activate or deactivate this role
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Permissions Selection -->
            <div class="card mb-4">
              <div class="card-header">
                <h6 class="card-title mb-0" id="permissions-heading">
                  <i class="feather icon-lock me-2" appFeatherIcon></i>
                  {{ 'ROLES.PERMISSIONS_ASSIGNMENT' | translate }}
                </h6>
              </div>
              <div class="card-body" role="group" aria-labelledby="permissions-heading">
                <!-- Loading Permissions -->
                <div class="text-center py-3" *ngIf="loadingPermissions" aria-live="polite">
                  <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">{{ 'COMMON.LOADING' | translate }}...</span>
                  </div>
                  <small class="text-muted ms-2">{{ 'ROLES.LOADING_PERMISSIONS' | translate }}</small>
                </div>

                <!-- Permissions Loading Skeleton -->
                <div *ngIf="loadingPermissions" aria-hidden="true">
                  <app-loading-skeleton type="tree" [groups]="4" [children]="3"></app-loading-skeleton>
                </div>

                <!-- Permissions Tree -->
                <div *ngIf="!loadingPermissions && permissionsTree.length > 0" role="group" aria-labelledby="permissions-heading">
                  <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <small class="text-muted" id="permissions-help">{{ 'ROLES.SELECT_PERMISSIONS_HELP' | translate }}</small>
                      <div role="group" aria-label="Permission selection actions">
                        <button type="button" class="btn btn-sm btn-outline-primary me-2" (click)="selectAllPermissions()" aria-describedby="permissions-help">
                          {{ 'ROLES.SELECT_ALL' | translate }}
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" (click)="clearAllPermissions()" aria-describedby="permissions-help">
                          {{ 'ROLES.CLEAR_ALL' | translate }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Permissions Tree Structure -->
                  <div class="permissions-tree" role="tree" aria-label="Permissions tree" (keydown)="onPermissionsTreeKeydown($event)">
                    <div *ngFor="let group of permissionsTree; trackBy: trackByPermissionId" class="permission-group mb-3" role="treeitem" [attr.aria-expanded]="true">
                      <div class="card border-0 bg-light">
                        <div class="card-header bg-transparent border-0 py-2">
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="checkbox"
                              [id]="'group-' + group.id"
                              [checked]="isGroupSelected(group)"
                              (change)="toggleGroup(group, $event)"
                              role="checkbox"
                              [attr.aria-checked]="isGroupSelected(group)"
                              [attr.aria-describedby]="'group-desc-' + group.id">
                            <label class="form-check-label fw-bold" [for]="'group-' + group.id">
                              <i class="feather icon-folder me-2" appFeatherIcon></i>
                              {{ group.label }}
                            </label>
                            <div [id]="'group-desc-' + group.id" class="visually-hidden">
                              Permission group: {{ group.label }}. Select to toggle all permissions in this group.
                            </div>
                          </div>
                        </div>
                        <div class="card-body pt-0" role="group" [attr.aria-labelledby]="'group-' + group.id">
                          <div class="row" *ngIf="group.children && group.children.length > 0">
                            <div class="col-md-6" *ngFor="let permission of getGroupChildren(group); trackBy: trackByPermissionId">
                              <div class="form-check ms-3 mb-2">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  [id]="'permission-' + permission.id"
                                  [checked]="isPermissionSelected(permission)"
                                  (change)="togglePermission(permission, $event)"
                                  role="checkbox"
                                  [attr.aria-checked]="isPermissionSelected(permission)"
                                  [attr.aria-describedby]="'perm-desc-' + permission.id">
                                <label class="form-check-label" [for]="'permission-' + permission.id">
                                  <i class="feather icon-key me-1" appFeatherIcon></i>
                                  {{ permission.label }}
                                </label>
                                <div [id]="'perm-desc-' + permission.id" class="visually-hidden">
                                  Permission: {{ permission.label }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Selected Permissions Summary -->
                  <div class="mt-3" *ngIf="selectedPermissions.length > 0">
                    <h6>{{ 'ROLES.SELECTED_PERMISSIONS' | translate }} ({{ selectedPermissions.length }})</h6>
                    <div class="d-flex flex-wrap gap-1">
                      <span *ngFor="let permission of selectedPermissions" class="badge bg-primary">
                        {{ permission.label }}
                        <button type="button" class="btn-close btn-close-white ms-1" aria-label="Remove" (click)="removePermission(permission)"></button>
                      </span>
                    </div>
                  </div>

                  <!-- Permissions Validation Warning -->
                  <div class="mt-3" *ngIf="selectedPermissions.length === 0">
                    <div class="alert alert-warning d-flex align-items-center">
                      <i class="feather icon-alert-triangle me-2" appFeatherIcon></i>
                      <small>Please select at least one permission for this role.</small>
                    </div>
                  </div>
                </div>

                <!-- No Permissions Available -->
                <div class="text-center py-4" *ngIf="!loadingPermissions && permissionsTree.length === 0">
                  <i class="feather icon-alert-circle display-4 text-muted mb-3" appFeatherIcon></i>
                  <h6 class="text-muted">{{ 'ROLES.NO_PERMISSIONS_AVAILABLE' | translate }}</h6>
                  <p class="text-muted">{{ 'ROLES.NO_PERMISSIONS_MESSAGE' | translate }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Sidebar -->
          <div class="col-lg-4">
            <div class="card sticky-top">
              <div class="card-header">
                <h6 class="card-title mb-0">
                  <i class="feather icon-settings me-2" appFeatherIcon></i>
                  {{ 'ROLES.ACTIONS' | translate }}
                </h6>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="roleForm.invalid || saving || selectedPermissions.length === 0"
                    [attr.aria-label]="saving ? ('ROLES.SAVING' | translate) : (isEditMode ? ('ROLES.UPDATE_ROLE' | translate) : ('ROLES.CREATE_ROLE' | translate))">
                    <span *ngIf="saving; else saveText">
                      <i class="feather icon-loader me-2" appFeatherIcon></i>
                      {{ 'ROLES.SAVING' | translate }}...
                    </span>
                    <ng-template #saveText>
                      <i class="feather icon-save me-2" appFeatherIcon></i>
                      {{ isEditMode ? ('ROLES.UPDATE_ROLE' | translate) : ('ROLES.CREATE_ROLE' | translate) }}
                    </ng-template>
                  </button>

                  <a routerLink="/roles/list" class="btn btn-outline-secondary" aria-label="Cancel role form">
                    <i class="feather icon-x me-2" appFeatherIcon></i>
                    {{ 'COMMON.CANCEL' | translate }}
                  </a>
                </div>

                <!-- Form Summary -->
                <div class="mt-4">
                  <h6 class="text-muted mb-3">{{ 'ROLES.FORM_SUMMARY' | translate }}</h6>
                  <ul class="list-unstyled">
                    <li class="mb-2">
                      <small class="text-muted">{{ 'ROLES.FIELDS.NAME' | translate }}:</small><br>
                      <strong>{{ roleForm.get('name')?.value || ('COMMON.NOT_SPECIFIED' | translate) }}</strong>
                    </li>
                    <li class="mb-2">
                      <small class="text-muted">{{ 'ROLES.FIELDS.STATUS' | translate }}:</small><br>
                      <span [class]="'badge ' + (roleForm.get('isActive')?.value ? 'bg-success' : 'bg-secondary')">
                        {{ roleForm.get('isActive')?.value ? ('ROLES.ACTIVE' | translate) : ('ROLES.INACTIVE' | translate) }}
                      </span>
                    </li>
                    <li class="mb-2">
                      <small class="text-muted">{{ 'ROLES.SELECTED_PERMISSIONS' | translate }}:</small><br>
                      <span class="badge bg-info">{{ selectedPermissions.length }} {{ 'ROLES.PERMISSIONS' | translate }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `
})
export class RoleFormComponent implements OnInit {
  roleForm: FormGroup;
  isEditMode = false;
  roleId: number | null = null;
  loading = false;
  loadingPermissions = false;
  saving = false;
  error: string | null = null;

  permissionsTree: TreeNode[] = [];
  selectedPermissions: TreeNode[] = [];
  focusedPermissionIndex = -1;
  focusedGroupIndex = -1;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private errorHandler: ErrorHandlerService,
    private validationService: ValidationService,
    private keyboardNavigation: KeyboardNavigationService
  ) {
    this.roleForm = this.fb.group({
      name: ['', [
        Validators.required,
        this.validationService.roleNameValidator(),
        this.validationService.secureTextValidator()
      ], [this.roleNameValidator.bind(this)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loading = this.isEditMode;
    this.loadingPermissions = true;
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.roleId = +params['id'];
        this.loadRoleData();
      } else {
        this.loading = false;
      }
    });

    this.loadPermissions();
  }

  loadRoleData(): void {
    if (!this.roleId) return;

    this.loading = true;
    this.error = null;

    this.roleService.getRoleById(this.roleId).subscribe({
      next: (role: Role) => {
        this.originalRoleName = role.name; // Store original name for validation
        this.roleForm.patchValue({
          name: role.name,
          isActive: role.isActive
        });
        
        // Map role permissions to selected permissions
        if (role.permissions) {
          this.selectedPermissions = this.mapPermissionsToTreeNodes(role.permissions);
        }
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading role:', error);
        this.error = 'Failed to load role data. Please try again.';
        this.loading = false;
      }
    });
  }

  private mapPermissionsToTreeNodes(permissions: any[]): TreeNode[] {
    // Map the role's permissions to TreeNode format
    return permissions.map(permission => ({
      id: permission.id.toString(),
      key: permission.name,
      label: permission.name,
      data: permission.groupName || '',
      icon: 'key',
      isPermission: true,
      children: []
    }));
  }

  loadPermissions() {
    this.loadingPermissions = true;
    this.roleService.getPermissionsGroupedByGroupName().subscribe({
      next: (tree: TreeNode[]) => {
        this.permissionsTree = tree;
        this.loadingPermissions = false;
      },
      error: (error: any) => {
        console.error('Error loading permissions:', error);
        this.loadingPermissions = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.roleForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  toggleGroup(group: TreeNode, event: any): void {
    if (event.target.checked) {
      // Select all permissions in this group
      if (group.children) {
        (group.children as TreeNode[]).forEach(permission => {
          if (!this.isPermissionSelected(permission)) {
            this.selectedPermissions.push(permission);
          }
        });
      }
    } else {
      // Deselect all permissions in this group
      if (group.children) {
        (group.children as TreeNode[]).forEach(permission => {
          this.selectedPermissions = this.selectedPermissions.filter(p => p.id !== permission.id);
        });
      }
    }
  }

  togglePermission(permission: TreeNode, event: any): void {
    if (event.target.checked) {
      if (!this.isPermissionSelected(permission)) {
        this.selectedPermissions.push(permission);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(p => p.id !== permission.id);
    }
  }

  isGroupSelected(group: TreeNode): boolean {
    if (!group.children || group.children.length === 0) return false;

    return (group.children as TreeNode[]).every(permission =>
      this.isPermissionSelected(permission)
    );
  }

  isPermissionSelected(permission: TreeNode): boolean {
    return this.selectedPermissions.some(p => p.id === permission.id);
  }

  selectAllPermissions(): void {
    this.selectedPermissions = [];
    this.permissionsTree.forEach(group => {
      if (group.children) {
        (group.children as TreeNode[]).forEach(permission => {
          this.selectedPermissions.push(permission);
        });
      }
    });
  }

  clearAllPermissions(): void {
    this.selectedPermissions = [];
  }

  removePermission(permission: TreeNode): void {
    this.selectedPermissions = this.selectedPermissions.filter(p => p.id !== permission.id);
  }

  getGroupChildren(group: TreeNode): TreeNode[] {
    return Array.isArray(group.children) && group.children.length > 0 && typeof group.children[0] === 'object'
      ? group.children as TreeNode[]
      : [];
  }

  trackByPermissionId(index: number, item: TreeNode): string {
    return item.id;
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.markFormGroupTouched(this.roleForm);
      return;
    }

    if (!this.validatePermissions()) {
      return;
    }

    // Sanitize input data
    const formValue = this.roleForm.value;
    const sanitizedName = this.validationService.sanitizeInput(formValue.name);
    
    // Validate sanitized data
    const validationResult = this.validationService.validateRoleData({
      name: sanitizedName,
      permissions: this.selectedPermissions
    });

    if (!validationResult.isValid) {
      this.error = validationResult.errors.join(', ');
      return;
    }

    this.saving = true;
    this.error = null;

    const permissionIds = this.selectedPermissions.map(p => p.id);

    if (this.isEditMode && this.roleId) {
      // Update existing role
      const updateRequest: UpdateRoleRequest = {
        id: this.roleId,
        name: sanitizedName,
        isActive: formValue.isActive!,
        permissions: this.selectedPermissions
      };

      this.roleService.updateRole(updateRequest).subscribe({
          next: (response) => {
            this.saving = false;
            this.errorHandler.showSuccessMessage(
              'Success!', 
              'Role updated successfully.'
            ).then(() => {
              this.router.navigate(['/roles/list']);
            });
          },
          error: (error) => {
            console.error('Error updating role:', error);
            this.error = 'Failed to update role. Please try again.';
            this.saving = false;
          }
        });
    } else {
      // Create new role
      const createRequest: CreateRoleRequest = {
        name: sanitizedName,
        isActive: formValue.isActive!,
        permissions: this.selectedPermissions
      };

      this.roleService.createRole(createRequest).subscribe({
          next: (response) => {
            this.saving = false;
            this.errorHandler.showSuccessMessage(
              'Success!', 
              'Role created successfully.'
            ).then(() => {
              this.router.navigate(['/roles/list']);
            });
          },
          error: (error) => {
            console.error('Error creating role:', error);
            this.error = 'Failed to create role. Please try again.';
            this.saving = false;
          }
        });
    }
  }

  private markFormGroupTouched(formGroup: any): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Async validator for role name uniqueness
   */
  roleNameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.trim().length < 2) {
      return of(null);
    }

    const roleName = control.value.trim();
    
    // Skip validation if we're editing and the name hasn't changed
    if (this.isEditMode && this.roleId && roleName === this.originalRoleName) {
      return of(null);
    }

    return this.roleService.checkRoleNameExists(roleName).pipe(
      debounceTime(500),
      map(exists => exists ? { roleNameExists: true } : null),
      catchError(() => of(null))
    );
  }

  /**
   * Validate that at least one permission is selected
   */
  validatePermissions(): boolean {
    return this.selectedPermissions.length > 0;
  }

  /**
   * Get validation error message for role name
   */
  getRoleNameErrorMessage(): string {
    const nameControl = this.roleForm.get('name');
    if (nameControl?.errors) {
      if (nameControl.errors['roleNameExists']) {
        return 'This role name already exists';
      }
      // Use validation service for other error messages
      return this.validationService.getErrorMessage(nameControl.errors);
    }
    return '';
  }

  private originalRoleName: string = '';

  /**
   * Handle keyboard navigation on permissions tree
   */
  onPermissionsTreeKeydown(event: KeyboardEvent): void {
    if (this.permissionsTree.length === 0) return;

    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigatePermissions('down');
        handled = true;
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.navigatePermissions('up');
        handled = true;
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.navigatePermissions('right');
        handled = true;
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.navigatePermissions('left');
        handled = true;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handlePermissionAction(this.focusedGroupIndex, this.focusedPermissionIndex, 'toggle');
        handled = true;
        break;

      case 'Home':
        event.preventDefault();
        this.focusPermissionItem(0, -1);
        handled = true;
        break;

      case 'End':
        event.preventDefault();
        this.focusPermissionItem(this.permissionsTree.length - 1, -1);
        handled = true;
        break;
    }

    if (handled) {
      event.stopPropagation();
    }
  }

  /**
   * Navigate through permissions tree
   */
  navigatePermissions(direction: 'up' | 'down' | 'left' | 'right'): void {
    if (this.permissionsTree.length === 0) return;

    let newGroupIndex = this.focusedGroupIndex;
    let newPermissionIndex = this.focusedPermissionIndex;

    switch (direction) {
      case 'down':
        if (this.focusedPermissionIndex === -1) {
          // Currently on group, move to first permission
          const group = this.permissionsTree[this.focusedGroupIndex];
          if (group && this.getGroupChildren(group).length > 0) {
            newPermissionIndex = 0;
          } else if (this.focusedGroupIndex < this.permissionsTree.length - 1) {
            newGroupIndex = this.focusedGroupIndex + 1;
          }
        } else {
          // Currently on permission, move to next permission or next group
          const group = this.permissionsTree[this.focusedGroupIndex];
          const children = this.getGroupChildren(group);
          if (this.focusedPermissionIndex < children.length - 1) {
            newPermissionIndex = this.focusedPermissionIndex + 1;
          } else if (this.focusedGroupIndex < this.permissionsTree.length - 1) {
            newGroupIndex = this.focusedGroupIndex + 1;
            newPermissionIndex = -1;
          }
        }
        break;

      case 'up':
        if (this.focusedPermissionIndex === -1) {
          // Currently on group, move to previous group
          if (this.focusedGroupIndex > 0) {
            newGroupIndex = this.focusedGroupIndex - 1;
          }
        } else {
          // Currently on permission, move to previous permission or group
          if (this.focusedPermissionIndex > 0) {
            newPermissionIndex = this.focusedPermissionIndex - 1;
          } else {
            newPermissionIndex = -1;
          }
        }
        break;

      case 'right':
        if (this.focusedPermissionIndex === -1) {
          // Currently on group, expand to first permission
          const group = this.permissionsTree[this.focusedGroupIndex];
          if (group && this.getGroupChildren(group).length > 0) {
            newPermissionIndex = 0;
          }
        }
        break;

      case 'left':
        if (this.focusedPermissionIndex !== -1) {
          // Currently on permission, collapse to group
          newPermissionIndex = -1;
        }
        break;
    }

    this.focusPermissionItem(newGroupIndex, newPermissionIndex);
  }

  /**
   * Focus a specific permission item
   */
  focusPermissionItem(groupIndex: number, permissionIndex: number = -1): void {
    this.focusedGroupIndex = groupIndex;
    this.focusedPermissionIndex = permissionIndex;

    let elementId: string;
    if (permissionIndex === -1) {
      // Focus group checkbox
      elementId = `group-${this.permissionsTree[groupIndex]?.id}`;
    } else {
      // Focus permission checkbox
      const group = this.permissionsTree[groupIndex];
      const permission = this.getGroupChildren(group)[permissionIndex];
      elementId = `permission-${permission?.id}`;
    }

    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      this.keyboardNavigation.announceToScreenReader(
        permissionIndex === -1 
          ? `Group: ${this.permissionsTree[groupIndex]?.label}`
          : `Permission: ${this.getGroupChildren(this.permissionsTree[groupIndex])[permissionIndex]?.label}`
      );
    }
  }

  /**
   * Handle keyboard actions on permission items
   */
  handlePermissionAction(groupIndex: number, permissionIndex: number, action: string): void {
    if (action === 'toggle') {
      if (permissionIndex === -1) {
        // Toggle group
        const group = this.permissionsTree[groupIndex];
        this.toggleGroup(group, { target: { checked: !this.isGroupSelected(group) } });
      } else {
        // Toggle permission
        const group = this.permissionsTree[groupIndex];
        const permission = this.getGroupChildren(group)[permissionIndex];
        this.togglePermission(permission, { target: { checked: !this.isPermissionSelected(permission) } });
      }
    }
  }

  /**
   * Handle keyboard navigation on form fields
   */
  onFormKeydown(event: KeyboardEvent): void {
    const formElement = (event.target as HTMLElement).closest('form') as HTMLFormElement;
    if (formElement) {
      this.keyboardNavigation.handleFormNavigation(event, formElement);
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  onGlobalKeydown(event: KeyboardEvent): void {
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (!this.roleForm.invalid && !this.saving && this.selectedPermissions.length > 0) {
        this.onSubmit();
      }
    }

    // Escape to cancel
    if (event.key === 'Escape') {
      this.router.navigate(['/roles/list']);
    }

    // Ctrl/Cmd + A to select all permissions
    if ((event.ctrlKey || event.metaKey) && event.key === 'a' && event.target instanceof HTMLElement) {
      const isInPermissionsTree = event.target.closest('.permissions-tree');
      if (isInPermissionsTree) {
        event.preventDefault();
        this.selectAllPermissions();
        this.keyboardNavigation.announceToScreenReader('All permissions selected');
      }
    }
  }
}
