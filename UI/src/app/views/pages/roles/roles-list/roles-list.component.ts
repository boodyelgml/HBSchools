import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { RoleService, Role } from '../../../../core/services/role.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { ValidationService } from '../../../../core/services/validation.service';
import { KeyboardNavigationService } from '../../../../core/services/keyboard-navigation.service';
import { LoadingSkeletonComponent } from '../../../../shared/components/loading-skeleton/loading-skeleton.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FeatherIconDirective, TranslateModule, LoadingSkeletonComponent],
  template: `
    <div class="page-content">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin" role="banner">
        <div>
          <h4 class="mb-3 mb-md-0" id="page-title">{{ 'ROLES.TITLE' | translate }}</h4>
          <nav class="page-breadcrumb" aria-label="Breadcrumb navigation">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a href="#" aria-label="Go to dashboard">{{ 'DASHBOARD' | translate }}</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{ 'ROLES.TITLE' | translate }}</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex align-items-center flex-wrap text-nowrap" role="group" aria-label="Page actions">
          <a routerLink="/roles/add" class="btn btn-primary btn-icon-text mb-2 mb-md-0 me-2" aria-label="Add new role">
            <i class="feather icon-plus btn-icon-prepend" appFeatherIcon></i>
            {{ 'ROLES.ADD_ROLE' | translate }}
          </a>
          <a routerLink="/roles/permissions" class="btn btn-outline-info btn-icon-text mb-2 mb-md-0" aria-label="Manage permissions">
            <i class="feather icon-shield btn-icon-prepend" appFeatherIcon></i>
            {{ 'ROLES.MANAGE_PERMISSIONS' | translate }}
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" *ngIf="loading" aria-live="polite" aria-label="Loading roles">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ 'COMMON.LOADING' | translate }}...</span>
          </div>
          <p class="mt-3 text-muted">{{ 'ROLES.LOADING_ROLES' | translate }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div class="row" *ngIf="error && !loading" aria-live="assertive">
        <div class="col-12">
          <div class="alert alert-danger d-flex align-items-center" role="alert" aria-labelledby="error-title">
            <i class="feather icon-alert-triangle me-2" appFeatherIcon></i>
            <div>
              <strong id="error-title">{{ 'COMMON.ERROR' | translate }}!</strong> {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Roles List -->
      <div class="row" *ngIf="!loading">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">{{ 'ROLES.LIST_TITLE' | translate }}</h6>
            </div>
            <div class="card-body">
              <!-- Loading Skeleton -->
              <div *ngIf="loading">
                <app-loading-skeleton type="table" [columns]="4" [rows]="6"></app-loading-skeleton>
              </div>

              <!-- Search and Filter -->
              <div class="row mb-3" *ngIf="!loading" role="search" aria-label="Search and filter roles">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text" aria-hidden="true">
                      <i class="feather icon-search" appFeatherIcon></i>
                    </span>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="searchTerm"
                      (input)="onSearchInput($event)"
                      (keydown)="onSearchKeydown($event)"
                      placeholder="{{ 'ROLES.SEARCH_PLACEHOLDER' | translate }}"
                      aria-label="Search roles by name"
                      id="search-input">
                  </div>
                </div>
                <div class="col-md-6">
                  <select
                    class="form-select"
                    [(ngModel)]="statusFilter"
                    (change)="filterRoles()"
                    (keydown)="onFilterKeydown($event)"
                    aria-label="Filter roles by status"
                    id="status-filter">
                    <option value="">{{ 'ROLES.ALL_STATUSES' | translate }}</option>
                    <option value="true">{{ 'ROLES.ACTIVE' | translate }}</option>
                    <option value="false">{{ 'ROLES.INACTIVE' | translate }}</option>
                  </select>
                </div>
              </div>

              <!-- Roles Table -->
              <div class="table-responsive" *ngIf="!loading" role="region" aria-labelledby="roles-table-caption">
                <table class="table table-hover" role="table" aria-label="Roles list">
                  <caption id="roles-table-caption" class="visually-hidden">
                    List of {{ filteredRoles.length }} roles with their details and actions
                  </caption>
                  <thead>
                    <tr role="row">
                      <th scope="col">{{ 'ROLES.TABLE.ID' | translate }}</th>
                      <th scope="col">{{ 'ROLES.TABLE.NAME' | translate }}</th>
                      <th scope="col">{{ 'ROLES.TABLE.PERMISSIONS_COUNT' | translate }}</th>
                      <th scope="col">{{ 'ROLES.TABLE.STATUS' | translate }}</th>
                      <th scope="col">{{ 'ROLES.TABLE.ACTIONS' | translate }}</th>
                    </tr>
                  </thead>
                  <tbody (keydown)="onTableKeydown($event)">
                    <tr *ngFor="let role of filteredRoles; let i = index; trackBy: trackByRoleId" 
                        role="row"
                        [attr.data-row-index]="i"
                        [attr.tabindex]="i === 0 ? '0' : '-1'"
                        [class.table-active]="i === selectedRowIndex"
                        (click)="selectRow(i)"
                        (focus)="focusedRowIndex = i"
                        [attr.aria-selected]="i === selectedRowIndex"
                        [attr.aria-label]="'Role ' + role.name + ', row ' + (i + 1) + ' of ' + filteredRoles.length">
                      <td>{{ role.id }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="feather icon-shield text-primary me-2" appFeatherIcon aria-hidden="true"></i>
                          <strong>{{ role.name }}</strong>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-info" [attr.aria-label]="(role.permissions && role.permissions.length) || 0 + ' permissions assigned'">
                          {{ (role.permissions && role.permissions.length) || 0 }} {{ 'ROLES.PERMISSIONS' | translate }}
                        </span>
                      </td>
                      <td>
                        <span [class]="'badge ' + (role.isActive ? 'bg-success' : 'bg-secondary')" 
                              [attr.aria-label]="'Role status: ' + (role.isActive ? ('ROLES.ACTIVE' | translate) : ('ROLES.INACTIVE' | translate))">
                          {{ role.isActive ? ('ROLES.ACTIVE' | translate) : ('ROLES.INACTIVE' | translate) }}
                        </span>
                      </td>
                      <td>
                        <div class="dropdown">
                          <button
                            class="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            [id]="'dropdownMenuButton' + role.id"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            [attr.aria-label]="'Actions for role ' + role.name">
                            {{ 'ROLES.ACTIONS' | translate }}
                          </button>
                          <ul class="dropdown-menu" [attr.aria-labelledby]="'dropdownMenuButton' + role.id" role="menu">
                            <li role="none">
                              <a
                                class="dropdown-item"
                                [routerLink]="['/roles/edit', role.id]"
                                role="menuitem"
                                [attr.aria-label]="'Edit role ' + role.name">
                                <i class="feather icon-edit me-2" appFeatherIcon aria-hidden="true"></i>
                                {{ 'ROLES.EDIT' | translate }}
                              </a>
                            </li>
                            <li role="none">
                              <a
                                class="dropdown-item"
                                href="#"
                                (click)="viewPermissions(role, $event)"
                                role="menuitem"
                                [attr.aria-label]="'View permissions for role ' + role.name">
                                <i class="feather icon-eye me-2" appFeatherIcon aria-hidden="true"></i>
                                {{ 'ROLES.VIEW_PERMISSIONS' | translate }}
                              </a>
                            </li>
                            <li role="none"><hr class="dropdown-divider"></li>
                            <li role="none">
                              <a
                                class="dropdown-item text-danger"
                                href="#"
                                (click)="confirmDelete(role, $event)"
                                role="menuitem"
                                [attr.aria-label]="'Delete role ' + role.name">
                                <i class="feather icon-trash-2 me-2" appFeatherIcon aria-hidden="true"></i>
                                {{ 'ROLES.DELETE' | translate }}
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- No Data State -->
                <div class="text-center py-5" *ngIf="filteredRoles.length === 0 && !loading" role="status" aria-live="polite">
                  <i class="feather icon-inbox display-4 text-muted mb-3" appFeatherIcon aria-hidden="true"></i>
                  <h5 class="text-muted" id="no-roles-title">{{ 'ROLES.NO_ROLES_FOUND' | translate }}</h5>
                  <p class="text-muted" aria-describedby="no-roles-title">{{ 'ROLES.NO_ROLES_MESSAGE' | translate }}</p>
                  <a routerLink="/roles/add" class="btn btn-primary" aria-label="Add your first role">
                    <i class="feather icon-plus me-2" appFeatherIcon aria-hidden="true"></i>
                    {{ 'ROLES.ADD_FIRST_ROLE' | translate }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RolesListComponent implements OnInit {
  roles: Role[] = [];
  filteredRoles: Role[] = [];
  loading = false;
  error: string | null = null;
  searchTerm: string = '';
  statusFilter = '';
  selectedRowIndex = -1;
  focusedRowIndex = -1;

  constructor(
    private roleService: RoleService,
    private errorHandler: ErrorHandlerService,
    private validationService: ValidationService,
    private keyboardNavigation: KeyboardNavigationService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading = true;
    this.error = null;

    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles = roles;
        this.filteredRoles = roles;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading roles:', error);
        this.error = 'Failed to load roles. Please try again.';
        this.loading = false;
      }
    });
  }

  onSearchInput(event: any): void {
    // Sanitize search input
    const rawInput = event.target.value;
    this.searchTerm = this.validationService.sanitizeInput(rawInput);
    
    // Update the input field with sanitized value
    event.target.value = this.searchTerm;
    
    this.filterRoles();
  }

  filterRoles(): void {
    this.filteredRoles = this.roles.filter(role => {
      const matchesSearch = !this.searchTerm || 
        role.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || 
        role.isActive.toString() === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  viewPermissions(role: Role, event: Event): void {
    event.preventDefault();

    const permissionsList = role.permissions.map(p => `• ${p.name}`).join('<br>');

    Swal.fire({
      title: `${role.name} Permissions`,
      html: permissionsList || 'No permissions assigned',
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

  confirmDelete(role: Role, event: Event): void {
    event.preventDefault();

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the role "${role.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRole(role);
      }
    });
  }

  private deleteRole(role: Role): void {
    // Validate role ID
    if (!this.validationService.isValidId(role.id)) {
      this.errorHandler.showError(
        'Validation Error',
        'Invalid role ID.'
      );
      return;
    }

    // Sanitize role name for display
    const sanitizedRoleName = this.validationService.sanitizeInput(role.name);

    this.roleService.deleteRole(role.id).subscribe({
      next: (response: any) => {
        this.errorHandler.showSuccessMessage(
          'Deleted!',
          `Role "${sanitizedRoleName}" has been deleted successfully.`
        );

        // Remove from local array
        this.roles = this.roles.filter(r => r.id !== role.id);
        this.filterRoles();
      },
      error: (error: any) => {
            console.error('Error deleting role:', error);
            this.errorHandler.showError(
              'Error!',
              'Failed to delete role. Please try again.'
            );
          }
    });
  }

  trackByRoleId(index: number, role: Role): number {
    return role.id;
  }

  /**
   * Handle keyboard navigation on the roles table
   */
  onTableKeydown(event: KeyboardEvent): void {
    if (this.filteredRoles.length === 0) return;

    const handled = this.keyboardNavigation.handleTableNavigation(
      event,
      this.focusedRowIndex,
      this.filteredRoles.length,
      (index: number) => this.selectRow(index),
      (index: number, action: string) => this.handleRowAction(index, action)
    );

    if (handled) {
      this.keyboardNavigation.announceToScreenReader(
        `Row ${this.focusedRowIndex + 1} of ${this.filteredRoles.length} selected. Role: ${this.filteredRoles[this.focusedRowIndex]?.name}`
      );
    }
  }

  /**
   * Select a table row
   */
  selectRow(index: number): void {
    if (index >= 0 && index < this.filteredRoles.length) {
      this.focusedRowIndex = index;
      this.selectedRowIndex = index;
      
      // Focus the row element
      const rowElement = document.querySelector(`[data-row-index="${index}"]`) as HTMLElement;
      if (rowElement) {
        rowElement.focus();
      }
    }
  }

  /**
   * Handle keyboard actions on table rows
   */
  handleRowAction(index: number, action: string): void {
    if (index < 0 || index >= this.filteredRoles.length) return;

    const role = this.filteredRoles[index];
    
    switch (action) {
      case 'edit':
        window.location.href = `/roles/edit/${role.id}`;
        break;
      case 'delete':
        this.confirmDelete(role, new Event('keydown'));
        break;
      case 'select':
        this.viewPermissions(role, new Event('keydown'));
        break;
    }
  }

  /**
   * Handle keyboard navigation on search input
   */
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.filterRoles();
      this.keyboardNavigation.announceToScreenReader(
        `Search completed. ${this.filteredRoles.length} roles found.`
      );
    }
  }

  /**
   * Handle keyboard navigation on status filter
   */
  onFilterKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.filterRoles();
      this.keyboardNavigation.announceToScreenReader(
        `Filter applied. ${this.filteredRoles.length} roles found.`
      );
    }
  }
}
