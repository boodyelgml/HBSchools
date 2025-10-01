import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

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

// Role and Permission Models
export interface Permission {
  id: number;
  name: string;
  groupName: string;
  isActive: boolean;
  roles?: string[];
}

export interface Role {
  id: number;
  name: string;
  isActive: boolean;
  permissions: Permission[];
}

export interface TreeNode {
  id: string;
  key: string;
  label: string;
  data: string;
  icon: string;
  isPermission: boolean;
  children: string[] | TreeNode[];
}

export interface CreateRoleRequest {
  isActive: boolean;
  name: string;
  permissions: TreeNode[];
}

export interface UpdateRoleNameRequest {
  id: number;
  name: string;
}

export interface UpdateRoleRequest {
  id: number;
  name: string;
  isActive: boolean;
  permissions: TreeNode[];
}

export interface AttachRolesToUserRequest {
  userId: number;
  rolesList: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserWithRoles {
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
  authorities: Array<{ authority: string }>;
  rolesAndPermissions: Array<{
    id: number;
    name: string;
    permissions: Array<{
      id: number;
      group: string;
      name: string;
      isActive: boolean;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly apiUrl = 'http://localhost:9090/api/v1/auth';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {}

  // Get roles with permissions tree
  getRolesWithPermissionsTree(): Observable<TreeNode[]> {
    return this.http.get<ApiResponse<TreeNode[]>>(`${this.apiUrl}/roles_with_permissions_tree`)
      .pipe(
        map(response => response.data)
      );
  }

  // Get roles with permissions grouped by group name tree
  getRolesWithPermissionsGroupedTree(): Observable<TreeNode[]> {
    return this.http.get<ApiResponse<TreeNode[]>>(`${this.apiUrl}/roles_with_permissions_grouped_by_group_name_tree`)
      .pipe(
        map(response => response.data)
      );
  }

  // Get permissions grouped by group name
  getPermissionsGroupedByGroupName(): Observable<TreeNode[]> {
    return this.http.get<ApiResponse<TreeNode[]>>(`${this.apiUrl}/permissions_grouped_by_group_name`)
      .pipe(
        map(response => response.data)
      );
  }

  // Update role name
  updateRoleName(request: UpdateRoleNameRequest): Observable<Role> {
    return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/update_role_name`, request)
      .pipe(
        map(response => response.data)
      );
  }

  // Create role
  createRole(request: CreateRoleRequest): Observable<Role> {
    return this.http.post<ApiResponse<Role>>(`${this.apiUrl}/create_role`, request).pipe(
      map(response => response.data),
      this.errorHandler.handleError('create role', {
        retryConfig: { maxRetries: 1, delayMs: 1000, backoffMultiplier: 1 }
      })
    );
  }

  // Get all roles (using the roles_with_permissions_tree endpoint as fallback)
  getRoles(): Observable<Role[]> {
    return this.getRolesWithPermissionsTree().pipe(
      map((treeData: TreeNode[]) => this.transformTreeDataToRoles(treeData)),
      this.errorHandler.handleError('load roles', {
        retryConfig: { maxRetries: 2, delayMs: 1000, backoffMultiplier: 1.5 }
      })
    );
  }

  // Transform tree data to Role objects
  private transformTreeDataToRoles(treeData: TreeNode[]): Role[] {
    return treeData.map(item => ({
      id: parseInt(item.id) || 0,
      name: item.label || item.key || 'Unknown Role',
      isActive: true, // Default value, adjust based on actual data structure
      permissions: this.extractPermissionsFromTree(item)
    }));
  }

  // Extract permissions from tree structure
  private extractPermissionsFromTree(item: TreeNode): Permission[] {
    if (!item.children || !Array.isArray(item.children)) return [];

    return (item.children as TreeNode[])
      .filter(child => child.isPermission)
      .map(permission => ({
        id: parseInt(permission.id) || 0,
        name: permission.label || permission.key || 'Unknown Permission',
        groupName: permission.data || 'Default',
        isActive: true,
        roles: []
      }));
  }

  // Get role by ID (using roles tree as fallback since direct endpoint may not exist)
  getRoleById(id: number): Observable<Role> {
    return this.getRoles().pipe(
      map((roles: Role[]) => {
        const role = roles.find(r => r.id === id);
        if (!role) {
          throw new Error(`Role with ID ${id} not found`);
        }
        return role;
      }),
      this.errorHandler.handleError('load role', {
        retryConfig: { maxRetries: 2, delayMs: 1000, backoffMultiplier: 1.5 }
      })
    );
  }

  // Update role (including permissions)
  updateRole(request: UpdateRoleRequest): Observable<Role> {
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/roles/${request.id}`, request).pipe(
      map(response => response.data),
      this.errorHandler.handleError('update role', {
        retryConfig: { maxRetries: 1, delayMs: 1000, backoffMultiplier: 1 }
      })
    );
  }

  // Delete role
  deleteRole(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/roles/${id}`).pipe(
      this.errorHandler.handleError('delete role', {
        retryConfig: { maxRetries: 1, delayMs: 1000, backoffMultiplier: 1 }
      })
    );
  }

  // Check if role name exists
  checkRoleNameExists(name: string, excludeId?: number): Observable<boolean> {
    const params = excludeId ? `?excludeId=${excludeId}` : '';
    return this.http.get<ApiResponse<boolean>>(`${this.apiUrl}/roles/check-name/${encodeURIComponent(name)}${params}`).pipe(
      map(response => response.data),
      this.errorHandler.handleError('check role name', {
        retryConfig: { maxRetries: 2, delayMs: 500, backoffMultiplier: 1.5 }
      })
    );
  }

  // Get users with roles
  getUsersWithRoles(): Observable<UserWithRoles[]> {
    return this.http.get<ApiResponse<UserWithRoles[]>>(`${this.apiUrl}/users-with-roles`).pipe(
      map(response => response.data),
      this.errorHandler.handleError('load users with roles', {
        retryConfig: { maxRetries: 2, delayMs: 1000, backoffMultiplier: 1.5 }
      })
    );
  }

  // Attach roles to user
  attachRolesToUser(request: AttachRolesToUserRequest): Observable<UserWithRoles> {
    return this.http.post<ApiResponse<UserWithRoles>>(`${this.apiUrl}/attachRolesToUser`, request).pipe(
      map(response => response.data),
      this.errorHandler.handleError('assign roles', {
        retryConfig: { maxRetries: 1, delayMs: 1000, backoffMultiplier: 1 }
      })
    );
  }

  // Detach roles from user
  detachRolesFromUser(userId: number, roleIds: number[]): Observable<UserWithRoles> {
    return this.http.post<ApiResponse<UserWithRoles>>(`${this.apiUrl}/detachRolesFromUser`, { userId, rolesList: roleIds }).pipe(
      map(response => response.data),
      this.errorHandler.handleError('remove roles', {
        retryConfig: { maxRetries: 1, delayMs: 1000, backoffMultiplier: 1 }
      })
    );
  }
}
