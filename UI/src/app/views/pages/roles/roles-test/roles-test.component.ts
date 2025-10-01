import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherIconDirective } from '../../../../core/feather-icon/feather-icon.directive';
import { RoleService, TreeNode, Role, CreateRoleRequest } from '../../../../core/services/role.service';
import { RoleApiTesterService } from '../../../../core/services/role-api-tester.service';

@Component({
  selector: 'app-roles-test',
  standalone: true,
  imports: [CommonModule, TranslateModule, FeatherIconDirective],
  template: `
    <div class="page-content">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">
                <i class="feather icon-check-circle me-2" appFeatherIcon></i>
                Roles & Permissions API Test Dashboard
              </h5>
            </div>
            <div class="card-body">

              <!-- Test Status -->
              <div class="row mb-4">
                <div class="col-md-4">
                  <div class="card text-center border-primary">
                    <div class="card-body">
                      <i class="feather icon-database display-4 text-primary mb-3" appFeatherIcon></i>
                      <h5>GET Endpoints</h5>
                      <span class="badge" [class]="getEndpointsStatus === 'success' ? 'bg-success' : getEndpointsStatus === 'error' ? 'bg-danger' : 'bg-warning'">
                        {{ getEndpointsStatus || 'Not Tested' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card text-center border-info">
                    <div class="card-body">
                      <i class="feather icon-send display-4 text-info mb-3" appFeatherIcon></i>
                      <h5>POST Endpoints</h5>
                      <span class="badge" [class]="postEndpointsStatus === 'success' ? 'bg-success' : postEndpointsStatus === 'error' ? 'bg-danger' : 'bg-warning'">
                        {{ postEndpointsStatus || 'Not Tested' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card text-center border-success">
                    <div class="card-body">
                      <i class="feather icon-shield display-4 text-success mb-3" appFeatherIcon></i>
                      <h5>Role Service</h5>
                      <span class="badge" [class]="serviceStatus === 'success' ? 'bg-success' : serviceStatus === 'error' ? 'bg-danger' : 'bg-warning'">
                        {{ serviceStatus || 'Not Tested' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Test Controls -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="d-flex gap-2 flex-wrap">
                    <button
                      class="btn btn-primary"
                      (click)="testGetEndpoints()"
                      [disabled]="loading">
                      <i class="feather icon-download me-2" appFeatherIcon></i>
                      Test GET Endpoints
                    </button>
                    <button
                      class="btn btn-info"
                      (click)="testRoleService()"
                      [disabled]="loading">
                      <i class="feather icon-shield me-2" appFeatherIcon></i>
                      Test Role Service
                    </button>
                    <button
                      class="btn btn-success"
                      (click)="runAllTests()"
                      [disabled]="loading">
                      <i class="feather icon-play me-2" appFeatherIcon></i>
                      Run All Tests
                    </button>
                    <button
                      class="btn btn-outline-secondary"
                      (click)="clearResults()">
                      <i class="feather icon-refresh-cw me-2" appFeatherIcon></i>
                      Clear Results
                    </button>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div class="text-center py-4" *ngIf="loading">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Running tests...</span>
                </div>
                <p class="mt-2 text-muted">{{ loadingMessage }}</p>
              </div>

              <!-- Test Results -->
              <div *ngIf="testResults.length > 0 && !loading">
                <h6 class="mb-3">Test Results:</h6>
                <div class="accordion" id="testResultsAccordion">
                  <div class="accordion-item" *ngFor="let result of testResults; let i = index">
                    <h2 class="accordion-header" [id]="'heading' + i">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        [attr.data-bs-target]="'#collapse' + i"
                        aria-expanded="false"
                        [attr.aria-controls]="'collapse' + i">
                        <span [class]="'badge me-2 ' + (result.status === 'success' ? 'bg-success' : 'bg-danger')">
                          {{ result.status }}
                        </span>
                        {{ result.endpoint }} - {{ result.description }}
                      </button>
                    </h2>
                    <div
                      [id]="'collapse' + i"
                      class="accordion-collapse collapse"
                      [attr.aria-labelledby]="'heading' + i"
                      data-bs-parent="#testResultsAccordion">
                      <div class="accordion-body">
                        <div *ngIf="result.status === 'success'">
                          <h6 class="text-success">✅ Success</h6>
                          <pre class="bg-light p-3 rounded"><code>{{ result.data | json }}</code></pre>
                        </div>
                        <div *ngIf="result.status === 'error'">
                          <h6 class="text-danger">❌ Error</h6>
                          <div class="alert alert-danger">
                            {{ result.error }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- API Documentation -->
              <div class="mt-5">
                <h6>API Documentation:</h6>
                <div class="card">
                  <div class="card-body">
                    <pre class="bg-light p-3 rounded" style="white-space: pre-wrap;">{{ apiDocumentation }}</pre>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RolesTestComponent implements OnInit {
  loading = false;
  loadingMessage = '';
  testResults: any[] = [];
  getEndpointsStatus = '';
  postEndpointsStatus = '';
  serviceStatus = '';
  apiDocumentation = '';

  constructor(
    private roleService: RoleService,
    private apiTester: RoleApiTesterService
  ) {}

  ngOnInit(): void {
    this.apiDocumentation = this.apiTester.generateApiDocumentation();
  }

  async testGetEndpoints(): Promise<void> {
    this.loading = true;
    this.loadingMessage = 'Testing GET endpoints...';
    this.getEndpointsStatus = 'testing';

    try {
      const results = await this.apiTester.testGetEndpoints().toPromise();
      this.testResults = [...this.testResults, ...results];

      const hasErrors = results.some((r: any) => r.status === 'error');
      this.getEndpointsStatus = hasErrors ? 'error' : 'success';
    } catch (error) {
      this.getEndpointsStatus = 'error';
      console.error('GET endpoints test failed:', error);
    } finally {
      this.loading = false;
    }
  }

  async testRoleService(): Promise<void> {
    this.loading = true;
    this.loadingMessage = 'Testing Role Service methods...';
    this.serviceStatus = 'testing';

    try {
      // Test getRolesWithPermissionsTree
      const rolesTree = await this.roleService.getRolesWithPermissionsTree().toPromise();
      this.testResults.push({
        endpoint: 'RoleService.getRolesWithPermissionsTree',
        description: 'Get roles with permissions tree via service',
        status: 'success',
        data: rolesTree
      });

      // Test getPermissionsGroupedByGroupName
      const permissionsGrouped = await this.roleService.getPermissionsGroupedByGroupName().toPromise();
      this.testResults.push({
        endpoint: 'RoleService.getPermissionsGroupedByGroupName',
        description: 'Get permissions grouped by group name via service',
        status: 'success',
        data: permissionsGrouped
      });

      this.serviceStatus = 'success';
    } catch (error) {
      this.serviceStatus = 'error';
      this.testResults.push({
        endpoint: 'RoleService',
        description: 'Role service test',
        status: 'error',
        error: (error as Error).message || 'Unknown error'
      });
    } finally {
      this.loading = false;
    }
  }

  async runAllTests(): Promise<void> {
    this.clearResults();
    await this.testGetEndpoints();
    await this.testRoleService();
  }

  clearResults(): void {
    this.testResults = [];
    this.getEndpointsStatus = '';
    this.postEndpointsStatus = '';
    this.serviceStatus = '';
  }
}
