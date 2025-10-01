import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

export interface AlertOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private translate: TranslateService) {}

  /**
   * Show success alert
   */
  success(messageKey: string, titleKey: string = 'ALERTS.SUCCESS.TITLE'): Promise<any> {
    return Swal.fire({
      title: this.translate.instant(titleKey),
      text: this.translate.instant(messageKey),
      icon: 'success',
      confirmButtonText: this.translate.instant('ALERTS.BUTTONS.OK')
    });
  }

  /**
   * Show error alert
   */
  error(messageKey: string, titleKey: string = 'ALERTS.ERROR.TITLE'): Promise<any> {
    return Swal.fire({
      title: this.translate.instant(titleKey),
      text: this.translate.instant(messageKey),
      icon: 'error',
      confirmButtonText: this.translate.instant('ALERTS.BUTTONS.OK')
    });
  }

  /**
   * Show warning alert
   */
  warning(messageKey: string, titleKey: string = 'ALERTS.WARNING.TITLE'): Promise<any> {
    return Swal.fire({
      title: this.translate.instant(titleKey),
      text: this.translate.instant(messageKey),
      icon: 'warning',
      confirmButtonText: this.translate.instant('ALERTS.BUTTONS.OK')
    });
  }

  /**
   * Show info alert
   */
  info(messageKey: string, titleKey: string = 'ALERTS.INFO.TITLE'): Promise<any> {
    return Swal.fire({
      title: this.translate.instant(titleKey),
      text: this.translate.instant(messageKey),
      icon: 'info',
      confirmButtonText: this.translate.instant('ALERTS.BUTTONS.OK')
    });
  }

  /**
   * Show confirmation dialog
   */
  confirm(messageKey: string, titleKey: string = 'ALERTS.CONFIRM.TITLE'): Promise<any> {
    return Swal.fire({
      title: this.translate.instant(titleKey),
      text: this.translate.instant(messageKey),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('ALERTS.BUTTONS.YES'),
      cancelButtonText: this.translate.instant('ALERTS.BUTTONS.NO'),
      reverseButtons: true
    });
  }

  /**
   * Show custom alert with options
   */
  custom(options: AlertOptions): Promise<any> {
    return Swal.fire({
      title: options.title ? this.translate.instant(options.title) : undefined,
      text: options.text ? this.translate.instant(options.text) : undefined,
      icon: options.icon || 'info',
      showCancelButton: options.showCancelButton || false,
      confirmButtonText: options.confirmButtonText
        ? this.translate.instant(options.confirmButtonText)
        : this.translate.instant('ALERTS.BUTTONS.OK'),
      cancelButtonText: options.cancelButtonText
        ? this.translate.instant(options.cancelButtonText)
        : this.translate.instant('ALERTS.BUTTONS.CANCEL')
    });
  }

  /**
   * Show loading alert
   */
  loading(messageKey: string = 'ALERTS.INFO.LOADING'): void {
    Swal.fire({
      title: this.translate.instant('ALERTS.INFO.TITLE'),
      text: this.translate.instant(messageKey),
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Close any open alert
   */
  close(): void {
    Swal.close();
  }

  // Specific alert methods for common use cases

  /**
   * User management alerts
   */
  userCreated(): Promise<any> {
    return this.success('ALERTS.SUCCESS.USER_CREATED');
  }

  userUpdated(): Promise<any> {
    return this.success('ALERTS.SUCCESS.USER_UPDATED');
  }

  userDeleted(): Promise<any> {
    return this.success('ALERTS.SUCCESS.USER_DELETED');
  }

  confirmDeleteUser(): Promise<any> {
    return this.confirm('ALERTS.CONFIRM.DELETE_USER');
  }

  /**
   * Role management alerts
   */
  roleCreated(): Promise<any> {
    return this.success('ALERTS.SUCCESS.ROLE_CREATED');
  }

  roleUpdated(): Promise<any> {
    return this.success('ALERTS.SUCCESS.ROLE_UPDATED');
  }

  roleDeleted(): Promise<any> {
    return this.success('ALERTS.SUCCESS.ROLE_DELETED');
  }

  confirmDeleteRole(): Promise<any> {
    return this.confirm('ALERTS.CONFIRM.DELETE_ROLE');
  }

  /**
   * Authentication alerts
   */
  loginSuccess(): Promise<any> {
    return this.success('AUTH.LOGIN.LOGIN_SUCCESS');
  }

  loginFailed(): Promise<any> {
    return this.error('AUTH.LOGIN.LOGIN_FAILED');
  }

  registrationSuccess(): Promise<any> {
    return this.success('AUTH.REGISTER.REGISTRATION_SUCCESS');
  }

  registrationFailed(): Promise<any> {
    return this.error('AUTH.REGISTER.REGISTRATION_FAILED');
  }

  /**
   * Generic error alerts
   */
  networkError(): Promise<any> {
    return this.error('ALERTS.ERROR.NETWORK');
  }

  serverError(): Promise<any> {
    return this.error('ALERTS.ERROR.SERVER');
  }

  validationError(): Promise<any> {
    return this.error('ALERTS.ERROR.VALIDATION');
  }

  genericError(): Promise<any> {
    return this.error('ALERTS.ERROR.GENERIC');
  }
}
