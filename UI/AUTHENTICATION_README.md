# Authentication Implementation

## Overview

This implementation adds authentication functionality to the existing login view using the API endpoint:
- **URL**: `http://localhost:9090/api/v1/auth/authenticate`
- **Method**: POST
- **Body**: `{ "email": "string", "password": "string" }`

## Files Modified/Created

### New Files Created:
1. **`/src/app/core/services/auth.service.ts`** - Authentication service
2. **`/src/app/core/services/auth.interceptor.ts`** - HTTP interceptor for adding auth tokens

### Files Modified:
1. **`/src/app/views/pages/auth/login/login.component.ts`** - Updated to use reactive forms and AuthService
2. **`/src/app/views/pages/auth/login/login.component.html`** - Updated to use reactive forms with validation
3. **`/src/app/app.config.ts`** - Added HTTP interceptor configuration
4. **`/src/app/core/guards/auth.guard.ts`** - Updated to use AuthService

## Features Implemented

### 1. AuthService
- **authenticate()**: Makes POST request to login API
- **register()**: Makes POST request to register API
- **Token management**: Stores/retrieves authentication tokens
- **Login state tracking**: Observable-based login status
- **Logout functionality**: Clears tokens and updates state

### 2. Login Component
- **Reactive Forms**: Form validation for email and password
- **Error Handling**: Displays API errors to users
- **Loading State**: Shows loading spinner during authentication
- **User Not Found Handling**: Shows "Create New Account" button when user not found
- **Form Validation**: 
  - Email: Required and valid email format
  - Password: Required and minimum 6 characters

### 3. Register Component
- **Reactive Forms**: Form validation for all registration fields
- **Error Handling**: Displays API errors to users
- **Success Messages**: Shows success message and auto-redirects
- **Email Pre-filling**: Pre-fills email when coming from login page
- **Form Validation**:
  - First Name: Required, minimum 2 characters
  - Last Name: Required, minimum 2 characters
  - Email: Required and valid email format
  - Password: Required and minimum 6 characters
  - Terms Agreement: Required checkbox

### 3. HTTP Interceptor
- **Automatic Token Injection**: Adds Bearer token to all HTTP requests
- **Seamless Integration**: Works with all API calls

### 4. Auth Guard
- **Route Protection**: Prevents access to protected routes
- **Redirect Logic**: Redirects to login with return URL

## Usage

### Login Form
The login form includes:
- Email field (pre-filled with "admin@demo.com")
- Password field (pre-filled with "12345678")
- Remember me checkbox
- Submit button with loading state
- Error message display
- Form validation with real-time feedback
- **User Not Found**: Shows "Create New Account" button

### Registration Form
The registration form includes:
- First Name field with validation
- Last Name field with validation
- Email field with validation
- Password field with validation
- Terms agreement checkbox (required)
- Submit button with loading state
- Success/Error message display
- Form validation with real-time feedback

### API Integration

#### Login
When the login form is submitted:
1. Validates form data
2. Calls `AuthService.authenticate()` with credentials
3. On success: Stores token and redirects to return URL
4. On error: Displays error message to user
5. If user not found: Shows registration suggestion

#### Registration
When the registration form is submitted:
1. Validates form data
2. Calls `AuthService.register()` with user data
3. On success: Stores token, shows success message, and redirects
4. On error: Displays error message to user

### Token Management
- Tokens are stored in localStorage
- Automatically added to HTTP requests via interceptor
- Auth state is tracked via BehaviorSubject for reactive updates

## API Endpoints

### Login API
- **URL**: `http://localhost:9090/api/v1/auth/authenticate`
- **Method**: POST
- **Body**: `{ "email": "string", "password": "string" }`

### Registration API
- **URL**: `http://localhost:9090/api/v1/auth/register`
- **Method**: POST
- **Body**: 
  ```json
  {
    "firstName": "string",
    "lastName": "string", 
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "string",
    "message": "string", 
    "statusCode": "string"
  }
  ```

## Default Credentials
- **Email**: admin@demo.com
- **Password**: 12345678

## Error Handling
- Network errors are caught and displayed to user
- API error messages are shown in alert box
- Form validation errors appear below each field
- Loading states prevent multiple submissions
- **API Error Response Formats**: Handles multiple error response formats:
  
  **HTTP Error Format (401 Unauthorized):**
  ```json
  {
    "timestamp": "2025-10-01T09:35:47.002+00:00",
    "status": 401,
    "error": "Unauthorized",
    "path": "/api/v1/auth/authenticate"
  }
  ```
  
  **Custom API Error Format:**
  ```json
  {
    "status": "NOT_FOUND",
    "messages": "user with name : admin@demo.com not found",
    "timeStamp": "2025-10-01"
  }
  ```

- **Error Handling Logic**:
  1. **HTTP Status Codes**: Specific messages for 401, 403, 404 errors
  2. **Custom API Messages**: `error.error.messages` field
  3. **Standard Messages**: `error.error.message` field  
  4. **HTTP Status Text**: Falls back to error status text
  5. **Generic Fallback**: Default error message

- **User Experience Features**:
  - **401 Unauthorized**: Shows "Invalid email or password" + register suggestion
  - **404 Not Found**: Shows "User not found" + register suggestion  
  - **403 Forbidden**: Shows "Access forbidden" message
  - **Register Suggestions**: Automatically shown for user-not-found scenarios

## Security Considerations
- Tokens stored in localStorage (consider httpOnly cookies for production)
- HTTP interceptor adds Authorization header to all requests
- Auth guard protects routes requiring authentication
- Form validation prevents invalid submissions

## Testing the Implementation

### Login Flow
1. Start the application
2. Navigate to the login page
3. Use the default credentials or enter custom ones
4. The form will make a POST request to `http://localhost:9090/api/v1/auth/authenticate`
5. On successful authentication, user will be redirected
6. On failure, error message will be displayed

### Registration Flow
1. Navigate to the registration page (or click "Create New Account" from login)
2. Fill in the required fields (firstName, lastName, email, password)
3. Accept terms and conditions
4. The form will make a POST request to `http://localhost:9090/api/v1/auth/register`
5. On success: Shows success message and auto-redirects
6. On failure: Shows error message

### Logout Flow
1. After successful login, click on the profile avatar in the navbar
2. Click "Log Out" in the dropdown menu
3. Confirm logout in the dialog
4. User will be signed out and redirected to login page
5. User information will be cleared from the navbar

## Sign Out Implementation

### Logout Functionality
- **Location**: Available in the navbar profile dropdown
- **Confirmation**: Shows confirmation dialog before signing out
- **Process**:
  1. User clicks "Log Out" in profile dropdown
  2. SweetAlert2 confirmation dialog appears
  3. On confirmation: Clears tokens and user info from localStorage
  4. Shows success message
  5. Redirects to login page

### Navbar Integration
- **User Display**: Shows current user's name and email in profile dropdown
- **Authentication State**: Reactive updates based on login status
- **User Info Storage**: Stores user information in localStorage during login/register

### What Gets Cleared on Logout
- `authToken` - JWT authentication token
- `isLoggedin` - Login status flag
- `userInfo` - User profile information (name, email)

## Future Enhancements
- ✅ Logout functionality in navbar (COMPLETED)
- Implement refresh token logic
- Add password reset functionality
- Consider using httpOnly cookies for better security
- Add loading skeletons for better UX
- Decode JWT token for user information instead of localStorage
