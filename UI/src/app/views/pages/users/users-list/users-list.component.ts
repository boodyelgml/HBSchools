import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { UserService, User } from '../../../../core/services/user.service';
import { ExportService } from '../../../../core/services/export.service';
import { DateFormatService } from '../../../../core/services/date-format.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTooltipModule,
    FormsModule,
    FeatherIconDirective,
    TranslateModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  error = '';

  // Make Math available in template
  Math = Math;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // Search and filter
  searchTerm = '';
  statusFilter = 'all'; // all, active, inactive
  roleFilter = 'all';

  // Sorting
  sortBy = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private userService: UserService,
    private exportService: ExportService,
    private dateFormatService: DateFormatService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.error = 'Failed to load users. Please try again.';
        console.error('Error loading users:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(user =>
        this.statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    // Apply role filter
    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(user =>
        user.rolesAndPermissions.some((role: any) =>
          role.name.toLowerCase().includes(this.roleFilter.toLowerCase())
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = this.getSortValue(a, this.sortBy);
      let bValue = this.getSortValue(b, this.sortBy);

      if (this.sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    this.filteredUsers = filtered;
    this.totalItems = filtered.length;
  }

  getSortValue(user: User, sortBy: string): any {
    switch (sortBy) {
      case 'firstName': return user.firstName.toLowerCase();
      case 'lastName': return user.lastName.toLowerCase();
      case 'email': return user.email.toLowerCase();
      case 'username': return user.username.toLowerCase();
      case 'createdAt': return new Date(user.createdAt);
      case 'isActive': return user.isActive;
      default: return '';
    }
  }

  sort(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onRoleFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  getUserRoles(user: User): string {
    return user.rolesAndPermissions.map((role: any) => role.name).join(', ') || 'No roles assigned';
  }

  getUserStatus(user: User): string {
    return user.isActive ? 'Active' : 'Inactive';
  }

  toggleUserStatus(user: User): void {
    const action = user.isActive ? 'deactivate' : 'activate';
    const title = user.isActive ? 'Deactivate User' : 'Activate User';
    const text = `Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`;

    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: user.isActive ? '#d33' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.toggleUserStatus(user.id).subscribe({
          next: (updatedUser: User) => {
            user.isActive = updatedUser.isActive;
            Swal.fire({
              title: 'Success!',
              text: `User has been ${action}d successfully.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: `Failed to ${action} user. Please try again.`,
              icon: 'error'
            });
            console.error(`Error ${action}ing user:`, error);
          }
        });
      }
    });
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: 'Delete User',
      text: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.applyFilters();
            Swal.fire({
              title: 'Deleted!',
              text: 'User has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error: any) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete user. Please try again.',
              icon: 'error'
            });
            console.error('Error deleting user:', error);
          }
        });
      }
    });
  }

  refresh(): void {
    this.loadUsers();
  }

  exportUsers(): void {
    Swal.fire({
      title: 'Export Users',
      text: 'Choose the export format:',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Excel (.xlsx)',
      denyButtonText: 'CSV (.csv)',
      cancelButtonText: 'PDF (.pdf)',
      confirmButtonColor: '#28a745',
      denyButtonColor: '#17a2b8',
      cancelButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.exportToExcel();
      } else if (result.isDenied) {
        this.exportToCsv();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.exportToPdf();
      }
    });
  }

  exportToCsv(): void {
    try {
      const dataToExport = this.getFilteredUsersForExport();
      this.exportService.exportToCsv(dataToExport, {
        filename: `users_export_${this.getCurrentDateString()}`,
        dateFormat: 'medium'
      });

      Swal.fire({
        title: 'Success!',
        text: 'Users exported to CSV successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to export users to CSV.',
        icon: 'error'
      });
    }
  }

  exportToExcel(): void {
    try {
      const dataToExport = this.getFilteredUsersForExport();
      this.exportService.exportToExcel(dataToExport, {
        filename: `users_export_${this.getCurrentDateString()}`,
        dateFormat: 'medium'
      });

      Swal.fire({
        title: 'Success!',
        text: 'Users exported to Excel successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to export users to Excel.',
        icon: 'error'
      });
    }
  }

  exportToPdf(): void {
    try {
      const dataToExport = this.getFilteredUsersForExport();
      this.exportService.exportToPdf(dataToExport, {
        filename: 'User Management Report',
        dateFormat: 'full'
      });

      Swal.fire({
        title: 'PDF Export',
        text: 'PDF export dialog opened. Please use your browser\'s print function to save as PDF.',
        icon: 'info',
        timer: 3000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to export users to PDF.',
        icon: 'error'
      });
    }
  }

  getFilteredUsersForExport(): User[] {
    // Return current filtered users or all users if no filter is applied
    return this.filteredUsers.length > 0 ? this.filteredUsers : this.users;
  }

  private getCurrentDateString(): string {
    return this.dateFormatService.getCurrentDateString();
  }

  formatDate(dateString: string | null | undefined, format: string = 'short'): string {
    return this.dateFormatService.formatForDisplay(dateString, format);
  }
}
