import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [CommonModule, RouterLink, FeatherIconDirective],
  template: `
    <div class="page-content">
      <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin" role="banner">
        <div>
          <h4 class="mb-3 mb-md-0" id="page-title">User Roles Management</h4>
        </div>
        <div class="d-flex align-items-center flex-wrap text-nowrap" role="group" aria-label="Page actions">
          <a routerLink="/users/list" class="btn btn-outline-secondary btn-icon-text me-2 mb-2 mb-md-0" aria-label="Go back to users list">
            <i class="feather icon-arrow-left btn-icon-prepend" appFeatherIcon aria-hidden="true"></i>
            Back to Users
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body" role="main" aria-labelledby="page-title">
              <h6 class="card-title" id="coming-soon-title">Roles & Permissions Management - Coming Soon</h6>
              <p aria-describedby="coming-soon-title">This feature will be implemented in the next phase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserRolesComponent {}
