import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { RoleService, TreeNode } from '../../../../core/services/role.service';

@Component({
  selector: 'app-permissions-tree',
  standalone: true,
  imports: [CommonModule, RouterLink, FeatherIconDirective, TranslateModule],
  template: `
    <div class="page-content">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
          <h4 class="mb-3 mb-md-0">{{ 'ROLES.PERMISSIONS_MANAGEMENT' | translate }}</h4>
          <nav class="page-breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/roles/list">{{ 'ROLES.TITLE' | translate }}</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{ 'ROLES.PERMISSIONS' | translate }}</li>
            </ol>
          </nav>
        </div>
        <div class="d-flex align-items-center flex-wrap text-nowrap">
          <a routerLink="/roles/list" class="btn btn-outline-secondary btn-icon-text mb-2 mb-md-0">
            <i class="feather icon-arrow-left btn-icon-prepend" appFeatherIcon></i>
            {{ 'ROLES.BACK_TO_ROLES' | translate }}
          </a>
        </div>
      </div>

      <!-- Loading State -->
      <div class="row" *ngIf="loading">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{ 'COMMON.LOADING' | translate }}...</span>
          </div>
          <p class="mt-3 text-muted">{{ 'ROLES.LOADING_PERMISSIONS_TREE' | translate }}</p>
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
        <!-- Roles with Permissions Tree -->
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-users me-2" appFeatherIcon></i>
                {{ 'ROLES.ROLES_WITH_PERMISSIONS' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="permissions-tree">
                <div *ngFor="let role of rolesWithPermissions; trackBy: trackByNodeId" class="role-item mb-3">
                  <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                      <div class="d-flex align-items-center">
                        <i class="feather icon-shield me-2" appFeatherIcon></i>
                        <strong>{{ role.label }}</strong>
                      </div>
                    </div>
                    <div class="card-body">
                      <div *ngIf="getRoleChildren(role).length > 0; else noPermissions">
                        <div class="row">
                          <div class="col-12" *ngFor="let permission of getRoleChildren(role); trackBy: trackByNodeId">
                            <div class="d-flex align-items-center mb-2">
                              <i class="feather icon-key text-success me-2" appFeatherIcon></i>
                              <span>{{ permission.label }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ng-template #noPermissions>
                        <div class="text-muted text-center py-2">
                          <i class="feather icon-info me-2" appFeatherIcon></i>
                          {{ 'ROLES.NO_PERMISSIONS_ASSIGNED' | translate }}
                        </div>
                      </ng-template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Roles State -->
              <div class="text-center py-5" *ngIf="rolesWithPermissions.length === 0">
                <i class="feather icon-users display-4 text-muted mb-3" appFeatherIcon></i>
                <h6 class="text-muted">{{ 'ROLES.NO_ROLES_FOUND' | translate }}</h6>
                <p class="text-muted">{{ 'ROLES.NO_ROLES_WITH_PERMISSIONS' | translate }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Permissions Grouped by Group Name -->
        <div class="col-lg-6">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">
                <i class="feather icon-lock me-2" appFeatherIcon></i>
                {{ 'ROLES.PERMISSIONS_BY_GROUP' | translate }}
              </h6>
            </div>
            <div class="card-body">
              <div class="permissions-groups">
                <div *ngFor="let group of permissionsByGroup; trackBy: trackByNodeId" class="permission-group mb-3">
                  <div class="card border-info">
                    <div class="card-header bg-info text-white">
                      <div class="d-flex align-items-center">
                        <i class="feather icon-folder me-2" appFeatherIcon></i>
                        <strong>{{ group.label }}</strong>
                      </div>
                    </div>
                    <div class="card-body">
                      <div *ngIf="getGroupChildren(group).length > 0; else noGroupPermissions">
                        <div class="row">
                          <div class="col-md-6" *ngFor="let permission of getGroupChildren(group); trackBy: trackByNodeId">
                            <div class="d-flex align-items-center mb-2">
                              <i class="feather icon-key text-primary me-2" appFeatherIcon></i>
                              <small>{{ permission.label }}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ng-template #noGroupPermissions>
                        <div class="text-muted text-center py-2">
                          <i class="feather icon-info me-2" appFeatherIcon></i>
                          {{ 'ROLES.NO_PERMISSIONS_IN_GROUP' | translate }}
                        </div>
                      </ng-template>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Permission Groups State -->
              <div class="text-center py-5" *ngIf="permissionsByGroup.length === 0">
                <i class="feather icon-lock display-4 text-muted mb-3" appFeatherIcon></i>
                <h6 class="text-muted">{{ 'ROLES.NO_PERMISSION_GROUPS' | translate }}</h6>
                <p class="text-muted">{{ 'ROLES.NO_PERMISSION_GROUPS_MESSAGE' | translate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div class="row mt-4" *ngIf="!loading">
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="feather icon-users display-4 text-primary mb-3" appFeatherIcon></i>
              <h4>{{ rolesWithPermissions.length }}</h4>
              <p class="text-muted mb-0">{{ 'ROLES.TOTAL_ROLES' | translate }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="feather icon-folder display-4 text-info mb-3" appFeatherIcon></i>
              <h4>{{ permissionsByGroup.length }}</h4>
              <p class="text-muted mb-0">{{ 'ROLES.PERMISSION_GROUPS' | translate }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="feather icon-key display-4 text-success mb-3" appFeatherIcon></i>
              <h4>{{ totalPermissions }}</h4>
              <p class="text-muted mb-0">{{ 'ROLES.TOTAL_PERMISSIONS' | translate }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="feather icon-shield display-4 text-warning mb-3" appFeatherIcon></i>
              <h4>{{ totalAssignedPermissions }}</h4>
              <p class="text-muted mb-0">{{ 'ROLES.ASSIGNED_PERMISSIONS' | translate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PermissionsTreeComponent implements OnInit {
  rolesWithPermissions: TreeNode[] = [];
  permissionsByGroup: TreeNode[] = [];
  loading = false;
  error: string | null = null;

  get totalPermissions(): number {
    return this.permissionsByGroup.reduce((total, group) => {
      return total + this.getGroupChildren(group).length;
    }, 0);
  }

  get totalAssignedPermissions(): number {
    return this.rolesWithPermissions.reduce((total, role) => {
      return total + this.getRoleChildren(role).length;
    }, 0);
  }

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    // Load both roles with permissions and permissions by group
    Promise.all([
      this.roleService.getRolesWithPermissionsTree().toPromise(),
      this.roleService.getPermissionsGroupedByGroupName().toPromise()
    ]).then(([rolesData, permissionsData]) => {
      this.rolesWithPermissions = rolesData || [];
      this.permissionsByGroup = permissionsData || [];
      this.loading = false;
    }).catch(error => {
      console.error('Error loading permissions tree data:', error);
      this.error = 'Failed to load permissions data. Please try again.';
      this.loading = false;
    });
  }

  getRoleChildren(role: TreeNode): TreeNode[] {
    return Array.isArray(role.children) && role.children.length > 0 && typeof role.children[0] === 'object'
      ? role.children as TreeNode[]
      : [];
  }

  getGroupChildren(group: TreeNode): TreeNode[] {
    return Array.isArray(group.children) && group.children.length > 0 && typeof group.children[0] === 'object'
      ? group.children as TreeNode[]
      : [];
  }

  trackByNodeId(index: number, item: TreeNode): string {
    return item.id;
  }
}
