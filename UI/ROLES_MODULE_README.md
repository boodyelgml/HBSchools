# Roles & Permissions Module

## Overview

This module implements a comprehensive Roles & Permissions management system for the Angular application, providing full CRUD operations for roles, permissions assignment, and user role management.

## Features

### 🔐 Core Functionality
- **Role Management**: Create, read, update, and delete roles
- **Permission Assignment**: Assign permissions to roles with tree-based selection
- **User Role Assignment**: Assign multiple roles to users
- **Hierarchical Permissions**: Tree-structured permission grouping
- **Status Management**: Active/Inactive role states

### 🌐 Internationalization
- **Multi-language Support**: Complete English and Arabic translations
- **RTL Support**: Proper right-to-left layout for Arabic
- **Dynamic Language Switching**: Real-time language updates

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Skeleton loading and spinners
- **Error Handling**: User-friendly error messages with retry mechanisms
- **Success Notifications**: SweetAlert2 confirmations
- **Search & Filter**: Real-time filtering and search capabilities

## API Integration

### GET Endpoints
- `GET /api/v1/auth/roles_with_permissions_tree` - Get roles with permissions in tree structure
- `GET /api/v1/auth/roles_with_permissions_grouped_by_group_name_tree` - Get roles grouped by group name
- `GET /api/v1/auth/permissions_grouped_by_group_name` - Get permissions grouped by group name

### POST Endpoints
- `POST /api/v1/auth/create_role` - Create a new role with permissions
- `POST /api/v1/auth/update_role_name` - Update role name
- `POST /api/v1/auth/attachRolesToUser` - Assign roles to a user

## File Structure

```
src/app/views/pages/roles/
├── roles.routes.ts                 # Routing configuration
├── roles-list/                     # Roles listing component
│   └── roles-list.component.ts
├── role-form/                      # Role creation/editing form
│   └── role-form.component.ts
├── permissions-tree/               # Permissions tree visualization
│   └── permissions-tree.component.ts
├── user-roles/                     # User role assignment
│   └── user-roles.component.ts
└── roles-test/                     # API testing component
    └── roles-test.component.ts

src/app/core/services/
├── role.service.ts                 # Main role service
├── role-api-tester.service.ts      # API testing service
├── error-handler.service.ts        # Error handling service
├── validation.service.ts           # Form validation service
└── keyboard-navigation.service.ts  # Accessibility service
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/roles/list` | RolesListComponent | Display all roles with search/filter |
| `/roles/add` | RoleFormComponent | Create new role |
| `/roles/edit/:id` | RoleFormComponent | Edit existing role |
| `/roles/permissions` | PermissionsTreeComponent | View permissions tree |
| `/roles/user-roles` | UserRolesComponent | Assign roles to users |
| `/roles/test` | RolesTestComponent | API testing dashboard |

## Components

### 1. RolesListComponent
- **Purpose**: Display and manage list of roles
- **Features**: Search, filter, status indicators, bulk actions
- **Navigation**: Links to edit, view permissions, and delete roles

### 2. RoleFormComponent
- **Purpose**: Create and edit roles with permission assignment
- **Features**: 
  - Role information form (name, status)
  - Hierarchical permission selection
  - Form validation with async name checking
  - Real-time form summary

### 3. PermissionsTreeComponent
- **Purpose**: Visualize roles and permissions hierarchy
- **Features**:
  - Tree structure display
  - Statistics dashboard
  - Role-permission mapping visualization

### 4. UserRolesComponent
- **Purpose**: Assign roles to users
- **Features**:
  - User selection dropdown
  - Multiple role assignment
  - Current roles display
  - Bulk role operations

### 5. RolesTestComponent
- **Purpose**: Test API endpoints and service functionality
- **Features**:
  - GET/POST endpoint testing
  - Service method validation
  - API documentation display

## Services

### RoleService
Main service handling all role-related API calls:

```typescript
// Get roles with permissions tree
getRolesWithPermissionsTree(): Observable<TreeNode[]>

// Get permissions grouped by group name  
getPermissionsGroupedByGroupName(): Observable<TreeNode[]>

// Create new role
createRole(request: CreateRoleRequest): Observable<Role>

// Update role name
updateRoleName(request: UpdateRoleNameRequest): Observable<Role>

// Assign roles to user
attachRolesToUser(request: AttachRolesToUserRequest): Observable<UserWithRoles>
```

### ErrorHandlerService
Handles HTTP errors with retry mechanisms and user-friendly messages.

### ValidationService
Provides form validation utilities and async validators.

### KeyboardNavigationService
Implements keyboard accessibility features.

## Models

### Core Interfaces

```typescript
interface Role {
  id: number;
  name: string;
  isActive: boolean;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
  groupName: string;
  isActive: boolean;
  roles?: string[];
}

interface TreeNode {
  id: string;
  key: string;
  label: string;
  data: string;
  icon: string;
  isPermission: boolean;
  children: string[] | TreeNode[];
}
```

### Request/Response Models

```typescript
interface CreateRoleRequest {
  isActive: boolean;
  name: string;
  permissions: TreeNode[];
}

interface UpdateRoleNameRequest {
  id: number;
  name: string;
}

interface AttachRolesToUserRequest {
  userId: number;
  rolesList: number[];
}
```

## Usage Examples

### Navigate to Roles Management
```html
<a routerLink="/roles/list">Manage Roles</a>
```

### Create New Role Programmatically
```typescript
const newRole: CreateRoleRequest = {
  name: 'Admin',
  isActive: true,
  permissions: selectedPermissions
};

this.roleService.createRole(newRole).subscribe(
  role => console.log('Role created:', role),
  error => console.error('Error:', error)
);
```

### Assign Roles to User
```typescript
const assignment: AttachRolesToUserRequest = {
  userId: 123,
  rolesList: [1, 2, 3]
};

this.roleService.attachRolesToUser(assignment).subscribe(
  user => console.log('Roles assigned:', user),
  error => console.error('Error:', error)
);
```

## Translation Keys

### English (en.json)
```json
{
  "ROLES": {
    "TITLE": "Roles & Permissions",
    "ADD_ROLE": "Add Role",
    "EDIT_ROLE": "Edit Role",
    "ROLE_INFORMATION": "Role Information",
    "PERMISSIONS_ASSIGNMENT": "Permissions Assignment"
  }
}
```

### Arabic (ar.json)
```json
{
  "ROLES": {
    "TITLE": "الأدوار والصلاحيات",
    "ADD_ROLE": "إضافة دور",
    "EDIT_ROLE": "تعديل الدور",
    "ROLE_INFORMATION": "معلومات الدور",
    "PERMISSIONS_ASSIGNMENT": "تعيين الصلاحيات"
  }
}
```

## Testing

### API Testing
Navigate to `/roles/test` to access the API testing dashboard:
- Test all GET endpoints
- Validate service methods
- View API documentation
- Monitor endpoint status

### Unit Testing
```bash
ng test --include="**/*role*.spec.ts"
```

### E2E Testing  
```bash
ng e2e --grep="roles"
```

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Logical tab order
- **Screen Reader Support**: Announcements for dynamic content
- **High Contrast**: Compatible with high contrast themes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- **Lazy Loading**: All role components are lazy-loaded
- **OnPush Change Detection**: Optimized change detection strategy
- **TrackBy Functions**: Efficient list rendering
- **Debounced Search**: Reduced API calls during search
- **Caching**: Service-level response caching

## Security Features

- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Built-in Angular CSRF tokens
- **Role-based Access**: Component-level access control
- **Input Validation**: Client and server-side validation

## Development

### Adding New Role Features
1. Create component in `/roles/` directory
2. Add route to `roles.routes.ts`
3. Update sidebar menu in `menu.ts`
4. Add translation keys to both language files
5. Update role service if new API endpoints needed

### Testing New Features
1. Use the testing component at `/roles/test`
2. Add unit tests for new functionality
3. Update E2E tests for user workflows
4. Test accessibility with screen readers

## Troubleshooting

### Common Issues

1. **Roles not loading**
   - Check API endpoint availability
   - Verify network connectivity
   - Check browser console for errors

2. **Permissions not displaying**
   - Verify tree structure in API response
   - Check TreeNode model alignment
   - Validate permission grouping logic

3. **Translation missing**
   - Add keys to both `en.json` and `ar.json`
   - Clear browser cache
   - Restart development server

### Debug Mode
Enable debug mode in role service:
```typescript
const DEBUG_MODE = true; // Set to true for detailed logging
```

## Contributing

1. Follow Angular style guide
2. Add comprehensive unit tests
3. Update documentation
4. Test accessibility features
5. Verify multi-language support

## License

This module is part of the HBSchools application and follows the project's licensing terms.
