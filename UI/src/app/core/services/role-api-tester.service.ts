import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * Service to test all Role API endpoints
 */
@Injectable({
  providedIn: 'root'
})
export class RoleApiTesterService {
  private readonly apiUrl = 'http://localhost:9090/api/v1/auth';

  constructor(private http: HttpClient) {}

  /**
   * Test all GET endpoints
   */
  testGetEndpoints(): Observable<any> {
    const endpoints = [
      {
        name: 'roles_with_permissions_tree',
        url: `${this.apiUrl}/roles_with_permissions_tree`,
        description: 'Get roles with permissions tree structure'
      },
      {
        name: 'roles_with_permissions_grouped_by_group_name_tree',
        url: `${this.apiUrl}/roles_with_permissions_grouped_by_group_name_tree`,
        description: 'Get roles with permissions grouped by group name tree'
      },
      {
        name: 'permissions_grouped_by_group_name',
        url: `${this.apiUrl}/permissions_grouped_by_group_name`,
        description: 'Get permissions grouped by group name'
      }
    ];

    const requests = endpoints.map(endpoint =>
      this.http.get(endpoint.url).pipe(
        map(response => ({
          endpoint: endpoint.name,
          description: endpoint.description,
          status: 'success',
          data: response
        })),
        catchError(error => [{
          endpoint: endpoint.name,
          description: endpoint.description,
          status: 'error',
          error: error.message || 'Unknown error'
        }])
      )
    );

    return forkJoin(requests);
  }

  /**
   * Test POST endpoints with sample data
   */
  testPostEndpoints(): Observable<any> {
    // Sample data for testing
    const sampleRoleData = {
      isActive: true,
      name: 'Test Role',
      permissions: [
        {
          id: '1',
          key: 'test_permission',
          label: 'Test Permission',
          data: 'test_data',
          icon: 'test-icon',
          isPermission: true,
          children: []
        }
      ]
    };

    const sampleUpdateData = {
      id: 1,
      name: 'Updated Test Role'
    };

    const sampleUserRoleData = {
      userId: 1,
      rolesList: [1, 2]
    };

    const endpoints = [
      {
        name: 'create_role',
        url: `${this.apiUrl}/create_role`,
        data: sampleRoleData,
        description: 'Create a new role'
      },
      {
        name: 'update_role_name',
        url: `${this.apiUrl}/update_role_name`,
        data: sampleUpdateData,
        description: 'Update role name'
      },
      {
        name: 'attachRolesToUser',
        url: `${this.apiUrl}/attachRolesToUser`,
        data: sampleUserRoleData,
        description: 'Attach roles to user'
      }
    ];

    const requests = endpoints.map(endpoint =>
      this.http.post(endpoint.url, endpoint.data).pipe(
        map(response => ({
          endpoint: endpoint.name,
          description: endpoint.description,
          status: 'success',
          data: response
        })),
        catchError(error => [{
          endpoint: endpoint.name,
          description: endpoint.description,
          status: 'error',
          error: error.message || 'Unknown error'
        }])
      )
    );

    return forkJoin(requests);
  }

  /**
   * Generate API documentation based on provided specifications
   */
  generateApiDocumentation(): string {
    return `
# Roles & Permissions API Documentation

## GET Endpoints

### 1. Get Roles with Permissions Tree
- **URL:** \`GET /api/v1/auth/roles_with_permissions_tree\`
- **Description:** Retrieves roles with their permissions in a tree structure
- **Response:** Array of TreeNode objects

### 2. Get Roles with Permissions Grouped by Group Name Tree
- **URL:** \`GET /api/v1/auth/roles_with_permissions_grouped_by_group_name_tree\`
- **Description:** Retrieves roles with permissions grouped by group name in tree structure
- **Response:** Array of TreeNode objects

### 3. Get Permissions Grouped by Group Name
- **URL:** \`GET /api/v1/auth/permissions_grouped_by_group_name\`
- **Description:** Retrieves permissions grouped by group name
- **Response:** Array of TreeNode objects

## POST Endpoints

### 1. Update Role Name
- **URL:** \`POST /api/v1/auth/update_role_name\`
- **Request Body:**
  \`\`\`json
  {
    "id": 0,
    "name": "string"
  }
  \`\`\`
- **Response:** Role object with updated name

### 2. Create Role
- **URL:** \`POST /api/v1/auth/create_role\`
- **Request Body:**
  \`\`\`json
  {
    "isActive": true,
    "name": "string",
    "permissions": [TreeNode objects]
  }
  \`\`\`
- **Response:** Created Role object

### 3. Attach Roles to User
- **URL:** \`POST /api/v1/auth/attachRolesToUser\`
- **Request Body:**
  \`\`\`json
  {
    "userId": 0,
    "rolesList": [0, 1, 2]
  }
  \`\`\`
- **Response:** UserWithRoles object

## Data Models

### TreeNode
\`\`\`typescript
interface TreeNode {
  id: string;
  key: string;
  label: string;
  data: string;
  icon: string;
  isPermission: boolean;
  children: string[] | TreeNode[];
}
\`\`\`

### Role
\`\`\`typescript
interface Role {
  id: number;
  name: string;
  isActive: boolean;
  permissions: Permission[];
}
\`\`\`

### Permission
\`\`\`typescript
interface Permission {
  id: number;
  name: string;
  groupName: string;
  isActive: boolean;
  roles?: string[];
}
\`\`\`
    `;
  }
}
