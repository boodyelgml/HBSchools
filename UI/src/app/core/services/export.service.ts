import { Injectable } from '@angular/core';
import { User } from './user.service';
import { DateFormatService } from './date-format.service';

export interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: 'short' | 'medium' | 'long' | 'full';
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private dateFormatService: DateFormatService) { }

  /**
   * Export users to CSV format
   */
  exportToCsv(users: User[], options: ExportOptions = {}): void {
    const filename = options.filename || `users_export_${this.getCurrentDateString()}`;
    const includeHeaders = options.includeHeaders !== false;
    const dateFormat = options.dateFormat || 'short';

    try {
      const csvContent = this.convertToCsv(users, includeHeaders, dateFormat);
      this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new Error('Failed to export users to CSV');
    }
  }

  /**
   * Export users to Excel format (CSV with Excel MIME type)
   */
  exportToExcel(users: User[], options: ExportOptions = {}): void {
    const filename = options.filename || `users_export_${this.getCurrentDateString()}`;
    const includeHeaders = options.includeHeaders !== false;
    const dateFormat = options.dateFormat || 'short';

    try {
      const csvContent = this.convertToCsv(users, includeHeaders, dateFormat);
      this.downloadFile(
        csvContent,
        `${filename}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw new Error('Failed to export users to Excel');
    }
  }

  /**
   * Export users to PDF format (opens print dialog)
   */
  exportToPdf(users: User[], options: ExportOptions = {}): void {
    const title = options.filename || 'Users Export Report';
    const dateFormat = options.dateFormat || 'medium';

    try {
      const htmlContent = this.generatePdfHtml(users, title, dateFormat);
      this.openPrintDialog(htmlContent);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export users to PDF');
    }
  }

  /**
   * Get export statistics
   */
  getExportStats(users: User[]): {
    total: number;
    active: number;
    inactive: number;
    withRoles: number;
    withoutRoles: number;
  } {
    return {
      total: users.length,
      active: users.filter(user => user.isActive).length,
      inactive: users.filter(user => !user.isActive).length,
      withRoles: users.filter(user => user.rolesAndPermissions && user.rolesAndPermissions.length > 0).length,
      withoutRoles: users.filter(user => !user.rolesAndPermissions || user.rolesAndPermissions.length === 0).length
    };
  }

  private convertToCsv(users: User[], includeHeaders: boolean, dateFormat: string): string {
    const headers = [
      'ID', 'Title', 'First Name', 'Middle Name', 'Last Name', 'Display Name',
      'Username', 'Email', 'Date of Birth', 'Marital Status',
      'Primary Address', 'Secondary Address', 'Postal Code',
      'Mobile Number', 'Work Number', 'Home Number',
      'Status', 'Roles', 'Authorities', 'Created Date', 'Updated Date'
    ];

    const rows: string[] = [];

    if (includeHeaders) {
      rows.push(headers.join(','));
    }

    users.forEach(user => {
      const row = [
        user.id?.toString() || '',
        this.escapeCsvField(user.title || ''),
        this.escapeCsvField(user.firstName || ''),
        this.escapeCsvField(user.middleName || ''),
        this.escapeCsvField(user.lastName || ''),
        this.escapeCsvField(user.displayName || ''),
        this.escapeCsvField(user.username || ''),
        this.escapeCsvField(user.email || ''),
        this.formatDate(user.dateOfBirth, dateFormat),
        this.escapeCsvField(user.maritalStatus || ''),
        this.escapeCsvField(user.firstAddress || ''),
        this.escapeCsvField(user.secondAddress || ''),
        this.escapeCsvField(user.postalCode || ''),
        this.escapeCsvField(user.mobileNumber || ''),
        this.escapeCsvField(user.workNumber || ''),
        this.escapeCsvField(user.homeNumber || ''),
        user.isActive ? 'Active' : 'Inactive',
        this.escapeCsvField(user.rolesAndPermissions?.map(role => role.name).join('; ') || ''),
        this.escapeCsvField(user.authorities?.map(auth => auth.authority).join('; ') || ''),
        this.formatDate(user.createdAt, dateFormat),
        this.formatDate(user.updatedAt, dateFormat)
      ];
      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  private escapeCsvField(field: string): string {
    if (!field) return '';

    // Escape fields that contain commas, quotes, or newlines
    if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  private formatDate(dateString: string | undefined, format: string): string {
    return this.dateFormatService.formatForExport(dateString, format as 'short' | 'medium' | 'long' | 'full');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for older browsers
      window.open(`data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`);
    }
  }

  private generatePdfHtml(users: User[], title: string, dateFormat: string): string {
    const currentDate = new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const stats = this.getExportStats(users);

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            font-size: 12px;
            margin: 20px;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #007bff;
          }

          .header h1 {
            color: #007bff;
            font-size: 24px;
            margin-bottom: 10px;
            font-weight: 700;
          }

          .header .subtitle {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 5px;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #dee2e6;
          }

          .summary-item {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .summary-item .number {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            display: block;
          }

          .summary-item .label {
            font-size: 11px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 5px;
          }

          .table-container {
            overflow-x: auto;
            margin-bottom: 30px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }

          th {
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          td {
            padding: 10px 8px;
            border-bottom: 1px solid #e9ecef;
            font-size: 10px;
            vertical-align: top;
          }

          tr:nth-child(even) {
            background-color: #f8f9fa;
          }

          tr:hover {
            background-color: #e3f2fd;
          }

          .status-active {
            background-color: #d4edda;
            color: #155724;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .status-inactive {
            background-color: #f8d7da;
            color: #721c24;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .roles {
            font-size: 9px;
            color: #495057;
            max-width: 120px;
            word-wrap: break-word;
          }

          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 10px;
          }

          .footer .company-info {
            margin-bottom: 10px;
            font-weight: 600;
          }

          .footer .disclaimer {
            font-style: italic;
            line-height: 1.4;
          }

          @media print {
            body {
              margin: 0;
            }
            .no-print {
              display: none;
            }
            .header h1 {
              font-size: 20px;
            }
            table {
              font-size: 9px;
            }
            th, td {
              padding: 6px 4px;
            }
          }

          @page {
            margin: 0.5in;
            size: A4 landscape;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <div class="subtitle">Generated on ${currentDate}</div>
          <div class="subtitle">Total Records: ${stats.total}</div>
        </div>

        <div class="summary">
          <div class="summary-item">
            <span class="number">${stats.total}</span>
            <div class="label">Total Users</div>
          </div>
          <div class="summary-item">
            <span class="number">${stats.active}</span>
            <div class="label">Active</div>
          </div>
          <div class="summary-item">
            <span class="number">${stats.inactive}</span>
            <div class="label">Inactive</div>
          </div>
          <div class="summary-item">
            <span class="number">${stats.withRoles}</span>
            <div class="label">With Roles</div>
          </div>
          <div class="summary-item">
            <span class="number">${stats.withoutRoles}</span>
            <div class="label">No Roles</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Roles</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(user => `
                <tr>
                  <td>${user.id || ''}</td>
                  <td>
                    <div style="font-weight: 600;">${user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</div>
                    ${user.title ? `<div style="font-size: 9px; color: #6c757d;">${user.title}</div>` : ''}
                  </td>
                  <td>${user.username || ''}</td>
                  <td>${user.email || ''}</td>
                  <td>${user.mobileNumber || ''}</td>
                  <td>
                    <span class="${user.isActive ? 'status-active' : 'status-inactive'}">
                      ${user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td class="roles">${user.rolesAndPermissions?.map(role => role.name).join(', ') || 'No roles'}</td>
                  <td>${this.formatDate(user.createdAt, dateFormat)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <div class="company-info">User Management System</div>
          <div class="disclaimer">
            This report was generated automatically and contains confidential information.<br>
            Distribution should be limited to authorized personnel only.<br>
            For questions or support, please contact the system administrator.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private openPrintDialog(htmlContent: string): void {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 250);

        // Close window after printing (user can cancel)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    } else {
      throw new Error('Unable to open print dialog. Please check your browser\'s popup settings.');
    }
  }

  private getCurrentDateString(): string {
    return this.dateFormatService.getCurrentDateString();
  }
}
