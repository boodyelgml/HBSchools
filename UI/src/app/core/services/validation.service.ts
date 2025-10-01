import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  /**
   * Sanitizes input by removing potentially harmful characters
   */
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove HTML tags and script content
    const htmlTagsRegex = /<[^>]*>/g;
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    
    let sanitized = input.replace(scriptRegex, '');
    sanitized = sanitized.replace(htmlTagsRegex, '');
    
    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>'"&]/g, '');
    
    // Trim whitespace
    sanitized = sanitized.trim();
    
    return sanitized;
  }

  /**
   * Validates role name format and content
   */
  roleNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Let required validator handle empty values
      }

      const errors: ValidationErrors = {};

      // Check for minimum length
      if (value.length < 2) {
        errors['minlength'] = { requiredLength: 2, actualLength: value.length };
      }

      // Check for maximum length
      if (value.length > 50) {
        errors['maxlength'] = { requiredLength: 50, actualLength: value.length };
      }

      // Check for valid characters (alphanumeric, spaces, hyphens, underscores)
      const validCharactersRegex = /^[a-zA-Z0-9\s\-_]+$/;
      if (!validCharactersRegex.test(value)) {
        errors['invalidCharacters'] = { message: 'Role name can only contain letters, numbers, spaces, hyphens, and underscores' };
      }

      // Check for leading/trailing spaces
      if (value !== value.trim()) {
        errors['leadingTrailingSpaces'] = { message: 'Role name cannot start or end with spaces' };
      }

      // Check for consecutive spaces
      if (/\s{2,}/.test(value)) {
        errors['consecutiveSpaces'] = { message: 'Role name cannot contain consecutive spaces' };
      }

      // Check for reserved words
      const reservedWords = ['admin', 'root', 'system', 'null', 'undefined', 'delete', 'drop'];
      if (reservedWords.includes(value.toLowerCase())) {
        errors['reservedWord'] = { message: 'This name is reserved and cannot be used' };
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  /**
   * Validates that at least one permission is selected
   */
  permissionsValidator(selectedPermissions: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!selectedPermissions || selectedPermissions.length === 0) {
        return { noPermissions: { message: 'At least one permission must be selected' } };
      }
      return null;
    };
  }

  /**
   * Validates email format
   */
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!emailRegex.test(value)) {
        return { invalidEmail: { message: 'Please enter a valid email address' } };
      }

      return null;
    };
  }

  /**
   * Validates that input doesn't contain SQL injection patterns
   */
  sqlInjectionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      // Common SQL injection patterns
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(--|\/\*|\*\/|;|'|")/,
        /(\bOR\b|\bAND\b).*(\b=\b|\b<\b|\b>\b)/i
      ];

      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          return { sqlInjection: { message: 'Input contains potentially harmful content' } };
        }
      }

      return null;
    };
  }

  /**
   * Validates that input doesn't contain XSS patterns
   */
  xssValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      // Common XSS patterns
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          return { xss: { message: 'Input contains potentially harmful content' } };
        }
      }

      return null;
    };
  }

  /**
   * Combines multiple validators for comprehensive input validation
   */
  secureTextValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sqlResult = this.sqlInjectionValidator()(control);
      const xssResult = this.xssValidator()(control);

      if (sqlResult) return sqlResult;
      if (xssResult) return xssResult;

      return null;
    };
  }

  /**
   * Gets user-friendly error message for validation errors
   */
  getErrorMessage(errors: ValidationErrors): string {
    if (errors['required']) {
      return 'This field is required';
    }
    
    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    }
    
    if (errors['maxlength']) {
      return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    }
    
    if (errors['invalidCharacters']) {
      return errors['invalidCharacters'].message;
    }
    
    if (errors['leadingTrailingSpaces']) {
      return errors['leadingTrailingSpaces'].message;
    }
    
    if (errors['consecutiveSpaces']) {
      return errors['consecutiveSpaces'].message;
    }
    
    if (errors['reservedWord']) {
      return errors['reservedWord'].message;
    }
    
    if (errors['invalidEmail']) {
      return errors['invalidEmail'].message;
    }
    
    if (errors['sqlInjection']) {
      return errors['sqlInjection'].message;
    }
    
    if (errors['xss']) {
      return errors['xss'].message;
    }
    
    if (errors['noPermissions']) {
      return errors['noPermissions'].message;
    }

    // Default message for unknown errors
    return 'Invalid input';
  }

  /**
   * Validates role data before submission
   */
  validateRoleData(roleData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate role name
    if (!roleData.name || roleData.name.trim().length === 0) {
      errors.push('Role name is required');
    } else {
      const sanitizedName = this.sanitizeInput(roleData.name);
      if (sanitizedName !== roleData.name) {
        errors.push('Role name contains invalid characters');
      }
    }

    // Validate permissions
    if (!roleData.permissions || roleData.permissions.length === 0) {
      errors.push('At least one permission must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates if an ID is valid (positive integer)
   */
  isValidId(id: any): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    
    const numId = Number(id);
    return Number.isInteger(numId) && numId > 0;
  }

  /**
   * Checks if input contains SQL injection patterns
   */
  containsSqlInjection(input: string): boolean {
    if (!input) return false;

    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
      /(--|\/\*|\*\/|;|'|")/,
      /(\bOR\b|\bAND\b).*(\b=\b|\b<\b|\b>\b)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Checks if input contains XSS patterns
   */
  containsXss(input: string): boolean {
    if (!input) return false;

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }
}