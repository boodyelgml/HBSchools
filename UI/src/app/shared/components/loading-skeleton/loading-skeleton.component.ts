import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-loader" [ngClass]="'skeleton-' + type">
      <!-- Card Skeleton -->
      <div *ngIf="type === 'card'" class="card">
        <div class="card-header">
          <div class="skeleton-line skeleton-title"></div>
        </div>
        <div class="card-body">
          <div class="skeleton-line skeleton-text" *ngFor="let line of getLines()"></div>
        </div>
      </div>

      <!-- Table Skeleton -->
      <div *ngIf="type === 'table'" class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th *ngFor="let col of getColumns()">
                <div class="skeleton-line skeleton-header"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of getRows()">
              <td *ngFor="let col of getColumns()">
                <div class="skeleton-line skeleton-cell"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Form Skeleton -->
      <div *ngIf="type === 'form'" class="form-skeleton">
        <div class="mb-3" *ngFor="let field of getFields()">
          <div class="skeleton-line skeleton-label"></div>
          <div class="skeleton-line skeleton-input"></div>
        </div>
      </div>

      <!-- List Skeleton -->
      <div *ngIf="type === 'list'" class="list-skeleton">
        <div class="list-item" *ngFor="let item of getItems()">
          <div class="d-flex align-items-center">
            <div class="skeleton-circle me-3"></div>
            <div class="flex-grow-1">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tree Skeleton -->
      <div *ngIf="type === 'tree'" class="tree-skeleton">
        <div class="tree-group" *ngFor="let group of getGroups()">
          <div class="d-flex align-items-center mb-2">
            <div class="skeleton-square me-2"></div>
            <div class="skeleton-line skeleton-title"></div>
          </div>
          <div class="ms-4">
            <div class="d-flex align-items-center mb-1" *ngFor="let child of getChildren()">
              <div class="skeleton-square me-2"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-loader {
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-line {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .skeleton-title {
      height: 20px;
      width: 60%;
    }

    .skeleton-subtitle {
      height: 16px;
      width: 40%;
    }

    .skeleton-text {
      height: 16px;
      width: 80%;
    }

    .skeleton-header {
      height: 18px;
      width: 90%;
    }

    .skeleton-cell {
      height: 16px;
      width: 70%;
    }

    .skeleton-label {
      height: 14px;
      width: 30%;
    }

    .skeleton-input {
      height: 38px;
      width: 100%;
    }

    .skeleton-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    .skeleton-square {
      width: 16px;
      height: 16px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 2px;
    }

    .list-item {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .tree-group {
      margin-bottom: 16px;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  `]
})
export class LoadingSkeletonComponent {
  @Input() type: 'card' | 'table' | 'form' | 'list' | 'tree' = 'card';
  @Input() lines: number = 3;
  @Input() columns: number = 4;
  @Input() rows: number = 5;
  @Input() fields: number = 4;
  @Input() items: number = 6;
  @Input() groups: number = 3;
  @Input() children: number = 4;

  getLines(): number[] {
    return Array(this.lines).fill(0);
  }

  getColumns(): number[] {
    return Array(this.columns).fill(0);
  }

  getRows(): number[] {
    return Array(this.rows).fill(0);
  }

  getFields(): number[] {
    return Array(this.fields).fill(0);
  }

  getItems(): number[] {
    return Array(this.items).fill(0);
  }

  getGroups(): number[] {
    return Array(this.groups).fill(0);
  }

  getChildren(): number[] {
    return Array(this.children).fill(0);
  }
}