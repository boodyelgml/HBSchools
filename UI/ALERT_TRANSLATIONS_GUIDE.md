# Alert Translations Documentation

## Overview
This document provides comprehensive guidance on using the alert translation system in the application. All alerts, messages, confirmations, and notifications are now fully translatable and organized in a structured manner.

## Translation Structure

### Main Alert Categories

#### 1. ALERTS Section
- **ALERTS.SUCCESS**: Success messages and confirmations
- **ALERTS.ERROR**: Error messages and failure notifications
- **ALERTS.WARNING**: Warning messages and cautionary alerts
- **ALERTS.CONFIRM**: Confirmation dialogs and user decisions
- **ALERTS.INFO**: Informational messages and status updates
- **ALERTS.BUTTONS**: Button labels for dialogs

#### 2. AUTH Section
- **AUTH.LOGIN**: Login-specific messages
- **AUTH.REGISTER**: Registration-specific messages
- **AUTH.VALIDATION**: Form validation messages

#### 3. Existing Sections (Enhanced)
- **USERS.MESSAGES**: User management messages
- **ROLES.MESSAGES**: Role management messages (if exists)
- **COMMON**: Common UI elements and actions

## Alert Service Usage

### Basic Usage

```typescript
import { AlertService } from '../core/services/alert.service';

constructor(private alertService: AlertService) {}

// Success alerts
this.alertService.success('ALERTS.SUCCESS.USER_CREATED');
this.alertService.userCreated(); // Shorthand method

// Error alerts
this.alertService.error('ALERTS.ERROR.NETWORK');
this.alertService.networkError(); // Shorthand method

// Confirmation dialogs
this.alertService.confirm('ALERTS.CONFIRM.DELETE_USER').then((result) => {
  if (result.isConfirmed) {
    // User confirmed deletion
  }
});

// Custom alerts
this.alertService.custom({
  title: 'ALERTS.WARNING.TITLE',
  text: 'ALERTS.WARNING.UNSAVED_CHANGES',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'ALERTS.BUTTONS.CONTINUE',
  cancelButtonText: 'ALERTS.BUTTONS.CANCEL'
});
```

### Direct SweetAlert2 Usage with Translations

```typescript
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

constructor(private translate: TranslateService) {}

// Success alert
Swal.fire({
  title: this.translate.instant('ALERTS.SUCCESS.TITLE'),
  text: this.translate.instant('ALERTS.SUCCESS.USER_CREATED'),
  icon: 'success',
  confirmButtonText: this.translate.instant('ALERTS.BUTTONS.OK')
});

// Confirmation dialog
Swal.fire({
  title: this.translate.instant('ALERTS.CONFIRM.TITLE'),
  text: this.translate.instant('ALERTS.CONFIRM.DELETE_USER'),
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: this.translate.instant('ALERTS.BUTTONS.YES'),
  cancelButtonText: this.translate.instant('ALERTS.BUTTONS.NO')
}).then((result) => {
  if (result.isConfirmed) {
    // Handle confirmation
  }
});
```

## Available Alert Keys

### Success Messages
- `ALERTS.SUCCESS.USER_CREATED`
- `ALERTS.SUCCESS.USER_UPDATED`
- `ALERTS.SUCCESS.USER_DELETED`
- `ALERTS.SUCCESS.USER_ACTIVATED`
- `ALERTS.SUCCESS.USER_DEACTIVATED`
- `ALERTS.SUCCESS.ROLE_CREATED`
- `ALERTS.SUCCESS.ROLE_UPDATED`
- `ALERTS.SUCCESS.ROLE_DELETED`
- `ALERTS.SUCCESS.ROLES_ASSIGNED`
- `ALERTS.SUCCESS.LOGIN_SUCCESS`
- `ALERTS.SUCCESS.REGISTRATION_SUCCESS`
- `ALERTS.SUCCESS.EXPORT_SUCCESS`
- `ALERTS.SUCCESS.OPERATION_SUCCESS`

### Error Messages
- `ALERTS.ERROR.GENERIC`
- `ALERTS.ERROR.NETWORK`
- `ALERTS.ERROR.SERVER`
- `ALERTS.ERROR.UNAUTHORIZED`
- `ALERTS.ERROR.NOT_FOUND`
- `ALERTS.ERROR.VALIDATION`
- `ALERTS.ERROR.LOGIN_FAILED`
- `ALERTS.ERROR.REGISTRATION_FAILED`
- `ALERTS.ERROR.USER_CREATION_FAILED`
- `ALERTS.ERROR.USER_UPDATE_FAILED`
- `ALERTS.ERROR.USER_DELETE_FAILED`
- `ALERTS.ERROR.ROLE_CREATION_FAILED`
- `ALERTS.ERROR.ROLE_UPDATE_FAILED`
- `ALERTS.ERROR.ROLE_DELETE_FAILED`
- `ALERTS.ERROR.ROLES_ASSIGNMENT_FAILED`
- `ALERTS.ERROR.EXPORT_FAILED`
- `ALERTS.ERROR.LOADING_FAILED`
- `ALERTS.ERROR.EMAIL_ALREADY_EXISTS`
- `ALERTS.ERROR.INVALID_CREDENTIALS`
- `ALERTS.ERROR.ACCESS_FORBIDDEN`

### Confirmation Messages
- `ALERTS.CONFIRM.DELETE_USER`
- `ALERTS.CONFIRM.DELETE_ROLE`
- `ALERTS.CONFIRM.ACTIVATE_USER`
- `ALERTS.CONFIRM.DEACTIVATE_USER`
- `ALERTS.CONFIRM.LOGOUT`
- `ALERTS.CONFIRM.RESET_FORM`
- `ALERTS.CONFIRM.DISCARD_CHANGES`
- `ALERTS.CONFIRM.DELETE_EVENT`

### Warning Messages
- `ALERTS.WARNING.UNSAVED_CHANGES`
- `ALERTS.WARNING.INVALID_DATA`
- `ALERTS.WARNING.INCOMPLETE_FORM`
- `ALERTS.WARNING.WEAK_PASSWORD`

### Information Messages
- `ALERTS.INFO.NO_DATA`
- `ALERTS.INFO.LOADING`
- `ALERTS.INFO.PROCESSING`
- `ALERTS.INFO.SAVING`
- `ALERTS.INFO.DELETING`
- `ALERTS.INFO.UPDATING`
- `ALERTS.INFO.ASSIGNING`

### Authentication Messages
- `AUTH.LOGIN.INVALID_CREDENTIALS`
- `AUTH.LOGIN.ACCESS_FORBIDDEN`
- `AUTH.LOGIN.USER_NOT_FOUND`
- `AUTH.LOGIN.AUTHENTICATION_FAILED`
- `AUTH.LOGIN.LOGIN_SUCCESS`
- `AUTH.LOGIN.LOGIN_FAILED`
- `AUTH.REGISTER.REGISTRATION_SUCCESS`
- `AUTH.REGISTER.REGISTRATION_FAILED`
- `AUTH.REGISTER.EMAIL_EXISTS`
- `AUTH.REGISTER.INVALID_DATA`
- `AUTH.REGISTER.DATA_FORMAT_ERROR`

### Validation Messages
- `AUTH.VALIDATION.EMAIL_REQUIRED`
- `AUTH.VALIDATION.EMAIL_INVALID`
- `AUTH.VALIDATION.PASSWORD_REQUIRED`
- `AUTH.VALIDATION.PASSWORD_MIN_LENGTH`
- `AUTH.VALIDATION.FIRST_NAME_REQUIRED`
- `AUTH.VALIDATION.LAST_NAME_REQUIRED`
- `AUTH.VALIDATION.CONFIRM_PASSWORD_REQUIRED`
- `AUTH.VALIDATION.PASSWORDS_DONT_MATCH`
- `AUTH.VALIDATION.FIELD_REQUIRED`
- `AUTH.VALIDATION.INVALID_FORMAT`

### Button Labels
- `ALERTS.BUTTONS.OK`
- `ALERTS.BUTTONS.CANCEL`
- `ALERTS.BUTTONS.YES`
- `ALERTS.BUTTONS.NO`
- `ALERTS.BUTTONS.CONTINUE`
- `ALERTS.BUTTONS.RETRY`
- `ALERTS.BUTTONS.CLOSE`

## Implementation Examples

### User Management Component
```typescript
export class UsersListComponent {
  constructor(private alertService: AlertService) {}

  deleteUser(user: User) {
    this.alertService.confirmDeleteUser().then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.alertService.userDeleted();
            this.loadUsers();
          },
          error: () => {
            this.alertService.error('ALERTS.ERROR.USER_DELETE_FAILED');
          }
        });
      }
    });
  }

  activateUser(user: User) {
    this.alertService.confirm('ALERTS.CONFIRM.ACTIVATE_USER').then((result) => {
      if (result.isConfirmed) {
        // Handle activation
        this.alertService.success('ALERTS.SUCCESS.USER_ACTIVATED');
      }
    });
  }
}
```

### Authentication Component
```typescript
export class LoginComponent {
  constructor(private alertService: AlertService) {}

  onLogin() {
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.alertService.loginSuccess();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.alertService.error('AUTH.LOGIN.INVALID_CREDENTIALS');
        } else if (error.status === 403) {
          this.alertService.error('AUTH.LOGIN.ACCESS_FORBIDDEN');
        } else {
          this.alertService.loginFailed();
        }
      }
    });
  }
}
```

### Form Validation
```typescript
export class UserFormComponent {
  getFieldErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return this.translate.instant('AUTH.VALIDATION.FIELD_REQUIRED');
      }
      if (field.errors['email']) {
        return this.translate.instant('AUTH.VALIDATION.EMAIL_INVALID');
      }
      if (field.errors['minlength']) {
        return this.translate.instant('AUTH.VALIDATION.PASSWORD_MIN_LENGTH');
      }
    }
    return '';
  }
}
```

## Best Practices

1. **Use Consistent Keys**: Always use the structured translation keys instead of hardcoded strings
2. **Service Methods**: Prefer using AlertService methods for common scenarios
3. **Error Handling**: Map different error types to appropriate translation keys
4. **User Experience**: Use appropriate alert types (success, error, warning, info) for different scenarios
5. **Confirmation Dialogs**: Always use confirmation dialogs for destructive actions
6. **Loading States**: Use loading alerts for long-running operations

## Migration from Hardcoded Alerts

### Before (Hardcoded)
```typescript
Swal.fire({
  title: 'Success!',
  text: 'User created successfully!',
  icon: 'success'
});
```

### After (Translated)
```typescript
this.alertService.userCreated();
// or
this.alertService.success('ALERTS.SUCCESS.USER_CREATED');
```

## Language Support

All alerts are available in:
- **English (en)**: Default language
- **Arabic (ar)**: Right-to-left support included

The alert system automatically adapts to the current language setting and provides appropriate RTL support for Arabic text.

## Extending the System

To add new alert translations:

1. Add the key to both `en.json` and `ar.json` files
2. Use the structured naming convention (e.g., `ALERTS.SUCCESS.NEW_FEATURE`)
3. Add corresponding methods to `AlertService` if needed
4. Update this documentation with the new keys

## Testing Alerts

Use browser developer tools to test alerts in different languages:
```javascript
// In browser console
localStorage.setItem('language', 'ar'); // Switch to Arabic
localStorage.setItem('language', 'en'); // Switch to English
// Then refresh the page
```
