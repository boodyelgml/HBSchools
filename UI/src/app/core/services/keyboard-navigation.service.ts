import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {

  constructor() { }

  /**
   * Handle keyboard navigation for tables
   * @param event - Keyboard event
   * @param currentIndex - Current row index
   * @param totalRows - Total number of rows
   * @param onRowSelect - Callback when row is selected
   * @param onRowAction - Callback when action is triggered
   */
  handleTableNavigation(
    event: KeyboardEvent,
    currentIndex: number,
    totalRows: number,
    onRowSelect: (index: number) => void,
    onRowAction?: (index: number, action: string) => void
  ): boolean {
    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < totalRows - 1) {
          onRowSelect(currentIndex + 1);
        }
        handled = true;
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          onRowSelect(currentIndex - 1);
        }
        handled = true;
        break;

      case 'Home':
        event.preventDefault();
        onRowSelect(0);
        handled = true;
        break;

      case 'End':
        event.preventDefault();
        onRowSelect(totalRows - 1);
        handled = true;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (onRowAction) {
          onRowAction(currentIndex, 'select');
        }
        handled = true;
        break;

      case 'Delete':
        event.preventDefault();
        if (onRowAction) {
          onRowAction(currentIndex, 'delete');
        }
        handled = true;
        break;

      case 'e':
      case 'E':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          if (onRowAction) {
            onRowAction(currentIndex, 'edit');
          }
          handled = true;
        }
        break;
    }

    return handled;
  }

  /**
   * Handle keyboard navigation for forms
   * @param event - Keyboard event
   * @param formElement - Form element
   */
  handleFormNavigation(event: KeyboardEvent, formElement: HTMLFormElement): boolean {
    let handled = false;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        // Find cancel button and click it
        const cancelButton = formElement.querySelector('button[type="button"]') as HTMLButtonElement;
        if (cancelButton) {
          cancelButton.click();
        }
        handled = true;
        break;

      case 'Enter':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          // Find submit button and click it
          const submitButton = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
          }
          handled = true;
        }
        break;
    }

    return handled;
  }

  /**
   * Handle keyboard navigation for dropdowns
   * @param event - Keyboard event
   * @param items - Array of dropdown items
   * @param currentIndex - Current selected index
   * @param onItemSelect - Callback when item is selected
   */
  handleDropdownNavigation(
    event: KeyboardEvent,
    items: any[],
    currentIndex: number,
    onItemSelect: (index: number) => void
  ): boolean {
    let handled = false;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        onItemSelect(nextIndex);
        handled = true;
        break;

      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        onItemSelect(prevIndex);
        handled = true;
        break;

      case 'Home':
        event.preventDefault();
        onItemSelect(0);
        handled = true;
        break;

      case 'End':
        event.preventDefault();
        onItemSelect(items.length - 1);
        handled = true;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        // Trigger selection
        handled = true;
        break;

      case 'Escape':
        event.preventDefault();
        // Close dropdown
        handled = true;
        break;
    }

    return handled;
  }

  /**
   * Focus management utilities
   */
  focusManagement = {
    /**
     * Set focus to the first focusable element in a container
     * @param container - Container element
     */
    focusFirst: (container: HTMLElement): void => {
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    },

    /**
     * Set focus to the last focusable element in a container
     * @param container - Container element
     */
    focusLast: (container: HTMLElement): void => {
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    },

    /**
     * Trap focus within a container
     * @param event - Keyboard event
     * @param container - Container element
     */
    trapFocus: (event: KeyboardEvent, container: HTMLElement): void => {
      if (event.key !== 'Tab') return;

      const focusableElements = this.getFocusableElements(container);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  /**
   * Get all focusable elements within a container
   * @param container - Container element
   * @returns Array of focusable elements
   */
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  /**
   * Announce content to screen readers
   * @param message - Message to announce
   * @param priority - Announcement priority ('polite' or 'assertive')
   */
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Skip link functionality
   * @param targetId - ID of the target element to skip to
   */
  skipToContent(targetId: string): void {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}