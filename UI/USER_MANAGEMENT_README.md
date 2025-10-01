# User Management System Documentation

## Overview

This comprehensive user management system provides full CRUD operations for managing users in the application. It includes listing, viewing, editing, adding, and managing user roles and permissions.

## API Integration

### Base URL
```
http://localhost:9090/api/v1/auth
```

### Users API Endpoint
- **GET** `/users` - Retrieve all users

### Response Format
```json
[
  {
    "id": 0,
    "title": "string",
    "firstName": "string",
    "middleName": "string",
    "lastName": "string",
    "displayName": "string",
    "dateOfBirth": "2025-10-01T12:34:43.535Z",
    "firstAddress": "string",
    "secondAddress": "string",
    "mobileNumber": 0,
    "workNumber": 0,
    "homeNumber": 0,
    "email": "string",
    "postalCode": 0,
    "maritalStatus": "string",
    "createdAt": "2025-10-01T12:34:43.535Z",
    "updatedAt": "2025-10-01T12:34:43.535Z",
    "isActive": true,
    "authorities": [
      {
        "authority": "string"
      }
    ],
    "username": "string",
    "rolesAndPermissions": [
      {
        "id": 0,
        "name": "string",
        "permissions": [
          {
            "id": 0,
            "group": "string",
            "name": "string",
            "isActive": true
          }
        ]
      }
    ]
  }
]
```

## Components Structure

### 1. **UsersListComponent** (`/users/list`)
**Purpose**: Main users listing page with advanced filtering, sorting, and pagination

**Features**:
- **Advanced Search**: Search by name, email, username
- **Status Filtering**: Filter by active/inactive users
- **Role Filtering**: Filter by user roles
- **Sorting**: Sort by name, email, username, created date, status
- **Pagination**: Configurable page sizes (5, 10, 25, 50)
- **Actions Dropdown**: View, Edit, Activate/Deactivate, Delete
- **Batch Operations**: Export functionality (placeholder)
- **Real-time Updates**: Automatic refresh after actions

**Key Functions**:
- `loadUsers()` - Fetches all users from API
- `applyFilters()` - Applies search, status, and role filters
- `sort(column)` - Handles column sorting
- `toggleUserStatus(user)` - Activates/deactivates users
- `deleteUser(user)` - Deletes users with confirmation

### 2. **UserDetailsComponent** (`/users/view/:id`)
**Purpose**: Display detailed user information

**Features**:
- **Complete User Profile**: Shows all user information
- **Roles & Permissions**: Displays assigned roles and permissions
- **Status Indicators**: Visual status badges
- **Action Buttons**: Edit user, back to list
- **Responsive Design**: Mobile-friendly layout

### 3. **UserFormComponent** (`/users/add`, `/users/edit/:id`)
**Purpose**: Add new users or edit existing ones (placeholder for future implementation)

### 4. **UserRolesComponent** (`/users/roles`)
**Purpose**: Manage user roles and permissions (placeholder for future implementation)

## Services

### **UserService**
Location: `src/app/core/services/user.service.ts`

**Methods**:
- `getAllUsers()`: GET all users
- `getUserById(id)`: GET user by ID
- `createUser(user)`: POST create new user
- `updateUser(id, user)`: PUT update user
- `deleteUser(id)`: DELETE user
- `toggleUserStatus(id)`: PATCH toggle user active status

**Interfaces**:
- `User`: Main user interface
- `UserRole`: User role with permissions
- `UserPermission`: Individual permission
- `UserAuthority`: User authority

## Sidebar Integration

### Menu Structure
Added to `src/app/views/layout/sidebar/menu.ts`:

```typescript
{
  label: 'User Management',
  icon: 'users',
  subItems: [
    {
      label: 'All Users',
      link: '/users/list',
    },
    {
      label: 'Add User',
      link: '/users/add'
    },
    {
      label: 'User Roles',
      link: '/users/roles'
    },
  ]
}
```

## Routing

### Routes Configuration
Location: `src/app/views/pages/users/users.routes.ts`

- `/users` → Redirects to `/users/list`
- `/users/list` → Users listing page
- `/users/add` → Add new user form
- `/users/edit/:id` → Edit user form
- `/users/view/:id` → User details page
- `/users/roles` → Roles management page

## UI/UX Features

### **Visual Design**
- **Modern Card Layout**: Clean, professional design
- **Avatar Initials**: User initials as profile pictures
- **Status Badges**: Color-coded status indicators
- **Role Tags**: Pill-shaped role indicators
- **Responsive Tables**: Mobile-friendly table design

### **Interactive Elements**
- **Sortable Columns**: Click to sort with direction indicators
- **Search as You Type**: Real-time search filtering
- **Dropdown Actions**: Comprehensive action menus
- **Confirmation Dialogs**: SweetAlert2 confirmations for destructive actions
- **Loading States**: Spinners and skeleton loading
- **Empty States**: Helpful messages when no data

### **User Experience**
- **Bulk Actions**: Select multiple users (future feature)
- **Export Options**: CSV/Excel export (placeholder)
- **Advanced Filters**: Multiple filter criteria
- **Pagination**: Efficient data loading
- **Success/Error Messages**: Clear feedback on actions

## Security & Permissions

- **Authentication Required**: All routes protected by auth guard
- **Role-based Access**: Users see actions based on permissions
- **Confirmation Dialogs**: Prevent accidental destructive actions
- **Error Handling**: Graceful error handling with user feedback

## Responsive Design

### **Mobile Optimizations**
- **Stacked Filters**: Filters stack on mobile devices
- **Horizontal Scroll**: Tables scroll horizontally on small screens
- **Touch-friendly**: Large touch targets for mobile users
- **Collapsed Actions**: Action menus optimize for touch

### **Desktop Features**
- **Multi-column Layout**: Efficient use of screen space
- **Keyboard Navigation**: Keyboard shortcuts for power users
- **Hover States**: Visual feedback on interactive elements

## Future Enhancements

### **Planned Features**
- **Advanced User Form**: Complete user creation/editing
- **Role Management**: Full roles and permissions system
- **Bulk Operations**: Multi-select and batch actions
- **User Import/Export**: CSV import/export functionality
- **User Groups**: Organize users into groups
- **Audit Trail**: Track user changes and activities
- **User Profiles**: Extended user profile information
- **Permission Matrix**: Visual permissions management

### **Technical Improvements**
- **Virtual Scrolling**: Handle large user lists efficiently
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Search**: Elasticsearch integration
- **Caching**: Implement smart caching strategies
- **Print Views**: Printer-friendly user reports

## Testing

### **Component Testing**
- Unit tests for all components
- Service integration tests
- Route testing
- Error handling tests

### **User Testing**
- Search functionality testing
- Filter combinations testing
- Pagination edge cases
- Mobile responsiveness testing

## Performance Considerations

- **Lazy Loading**: Components loaded on demand
- **Pagination**: Efficient data loading
- **Debounced Search**: Reduced API calls
- **Memoization**: Cached computed values
- **Virtual Scrolling**: Future large dataset handling

This user management system provides a solid foundation for comprehensive user administration with room for future enhancements and scalability.
