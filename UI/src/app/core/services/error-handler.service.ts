import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, finalize, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

export interface ErrorHandlerConfig {
  showUserMessage: boolean;
  logToConsole: boolean;
  retryConfig?: RetryConfig;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    delayMs: 1000,
    backoffMultiplier: 2
  };

  private readonly defaultConfig: ErrorHandlerConfig = {
    showUserMessage: true,
    logToConsole: true,
    retryConfig: this.defaultRetryConfig
  };

  constructor() {}

  /**
   * Handle HTTP errors with retry mechanism and user-friendly messages
   */
  handleError<T>(
    operation: string,
    config: Partial<ErrorHandlerConfig> = {}
  ) {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    return (source: Observable<T>): Observable<T> => {
      return source.pipe(
        retryWhen(errors => 
          errors.pipe(
            mergeMap((error, index) => {
              const retryConfig = finalConfig.retryConfig || this.defaultRetryConfig;
              
              if (index >= retryConfig.maxRetries || !this.isRetryableError(error)) {
                return throwError(() => error);
              }

              const delay = retryConfig.delayMs * Math.pow(retryConfig.backoffMultiplier, index);
              
              if (finalConfig.logToConsole) {
                console.warn(`Retrying ${operation} (attempt ${index + 1}/${retryConfig.maxRetries}) after ${delay}ms:`, error);
              }

              return timer(delay);
            })
          )
        ),
        tap({
          error: (error) => {
            if (finalConfig.logToConsole) {
              console.error(`Error in ${operation}:`, error);
            }

            if (finalConfig.showUserMessage) {
              this.showErrorMessage(operation, error);
            }
          }
        })
      );
    };
  }

  /**
   * Show user-friendly error message using SweetAlert2
   */
  private showErrorMessage(operation: string, error: any): void {
    const errorMessage = this.getErrorMessage(error);
    const title = this.getErrorTitle(operation);

    Swal.fire({
      title: title,
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      showCancelButton: true,
      cancelButtonText: 'Retry',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked retry - this would need to be handled by the calling component
        console.log('User requested retry for:', operation);
      }
    });
  }

  /**
   * Extract user-friendly error message from error object
   */
  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    switch (error?.status) {
      case 0:
        return 'Unable to connect to the server. Please check your internet connection.';
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to perform this action. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist or be in use.';
      case 422:
        return 'The data provided is invalid. Please check your input.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      case 502:
        return 'Bad gateway. The server is temporarily unavailable.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. The request took too long to process.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Get appropriate error title based on operation
   */
  private getErrorTitle(operation: string): string {
    const operationTitles: { [key: string]: string } = {
      'load roles': 'Failed to Load Roles',
      'create role': 'Failed to Create Role',
      'update role': 'Failed to Update Role',
      'delete role': 'Failed to Delete Role',
      'load users': 'Failed to Load Users',
      'assign roles': 'Failed to Assign Roles',
      'load permissions': 'Failed to Load Permissions',
      'load user roles': 'Failed to Load User Roles'
    };

    return operationTitles[operation.toLowerCase()] || 'Operation Failed';
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Don't retry client errors (4xx) except for 408 (timeout) and 429 (rate limit)
    if (error?.status >= 400 && error?.status < 500) {
      return error.status === 408 || error.status === 429;
    }

    // Retry server errors (5xx) and network errors (0)
    return error?.status >= 500 || error?.status === 0;
  }

  /**
   * Show success message
   */
  showSuccessMessage(title: string, message: string): Promise<any> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745'
    });
  }

  /**
   * Show error message
   */
  showError(title: string, message: string): Promise<any> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33'
    });
  }

  /**
   * Show confirmation dialog
   */
  showConfirmationDialog(
    title: string, 
    message: string, 
    confirmText: string = 'Yes', 
    cancelText: string = 'Cancel'
  ): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    }).then((result) => result.isConfirmed);
  }

  /**
   * Show loading dialog
   */
  showLoadingDialog(title: string = 'Loading...', message: string = 'Please wait'): void {
    Swal.fire({
      title: title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Close any open Swal dialog
   */
  closeDialog(): void {
    Swal.close();
  }
}