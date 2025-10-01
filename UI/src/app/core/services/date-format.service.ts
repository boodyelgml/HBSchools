import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {
  private datePipe = new DatePipe('en-US');

  /**
   * Format date for display in user interface
   * @param dateString ISO 8601 date string or Date object
   * @param format Angular DatePipe format (default: 'medium')
   * @returns Formatted date string
   */
  formatForDisplay(dateString: string | Date | null | undefined, format: string = 'medium'): string {
    if (!dateString) {
      return 'Not specified';
    }

    try {
      return this.datePipe.transform(dateString, format) || 'Invalid date';
    } catch (error) {
      console.warn('Date formatting error:', error);
      return 'Invalid date';
    }
  }

  /**
   * Format date for HTML date input (YYYY-MM-DD)
   * @param dateString ISO 8601 date string or Date object
   * @returns Date string in YYYY-MM-DD format
   */
  formatForInput(dateString: string | Date | null | undefined): string {
    if (!dateString) {
      return '';
    }

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Date input formatting error:', error);
      return '';
    }
  }

  /**
   * Format date for API submission (ISO 8601)
   * @param dateInput Date string from HTML input or Date object
   * @returns ISO 8601 formatted date string
   */
  formatForApi(dateInput: string | Date | null | undefined): string {
    if (!dateInput) {
      return '';
    }

    try {
      // If it's already a valid ISO string, return as is
      if (typeof dateInput === 'string' && dateInput.includes('T')) {
        return dateInput;
      }

      // If it's a date input (YYYY-MM-DD), convert to ISO
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        return '';
      }

      // For date inputs, set time to noon UTC to avoid timezone issues
      if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        date.setUTCHours(12, 0, 0, 0);
      }

      return date.toISOString();
    } catch (error) {
      console.warn('Date API formatting error:', error);
      return '';
    }
  }

  /**
   * Get time ago string (e.g., "2 hours ago", "3 days ago")
   * @param dateString ISO 8601 date string or Date object
   * @returns Human-readable time ago string
   */
  getTimeAgo(dateString: string | Date | null | undefined): string {
    if (!dateString) {
      return 'Unknown';
    }

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();

      if (isNaN(diffInMs)) {
        return 'Invalid date';
      }

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);

      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      } else if (diffInWeeks < 5) {
        return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
      } else if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
      } else {
        return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
      }
    } catch (error) {
      console.warn('Time ago calculation error:', error);
      return 'Unknown';
    }
  }

  /**
   * Format date for export files (CSV, Excel, PDF)
   * @param dateString ISO 8601 date string or Date object
   * @param format Export format type
   * @returns Formatted date string
   */
  formatForExport(dateString: string | Date | null | undefined, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
    if (!dateString) {
      return '';
    }

    try {
      return this.datePipe.transform(dateString, format) || '';
    } catch (error) {
      console.warn('Date export formatting error:', error);
      return '';
    }
  }

  /**
   * Get current date string for file naming (YYYY-MM-DD)
   * @returns Current date in YYYY-MM-DD format
   */
  getCurrentDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Validate if a date string is valid
   * @param dateString Date string to validate
   * @returns True if valid, false otherwise
   */
  isValidDate(dateString: string | Date | null | undefined): boolean {
    if (!dateString) {
      return false;
    }

    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    } catch (error) {
      return false;
    }
  }

  /**
   * Format date with custom pattern
   * @param dateString ISO 8601 date string or Date object
   * @param pattern Custom date pattern
   * @returns Formatted date string
   */
  formatCustom(dateString: string | Date | null | undefined, pattern: string): string {
    if (!dateString) {
      return '';
    }

    try {
      return this.datePipe.transform(dateString, pattern) || '';
    } catch (error) {
      console.warn('Custom date formatting error:', error);
      return '';
    }
  }
}
