import { Routes } from '@angular/router';

export const rolesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./roles-list/roles-list.component').then(c => c.RolesListComponent),
    title: 'Roles List'
  },
  {
    path: 'add',
    loadComponent: () => import('./role-form/role-form.component').then(c => c.RoleFormComponent),
    title: 'Add Role'
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./role-form/role-form.component').then(c => c.RoleFormComponent),
    title: 'Edit Role'
  },
  {
    path: 'permissions',
    loadComponent: () => import('./permissions-tree/permissions-tree.component').then(c => c.PermissionsTreeComponent),
    title: 'Permissions Management'
  },
  {
    path: 'user-roles',
    loadComponent: () => import('./user-roles/user-roles.component').then(c => c.UserRolesComponent),
    title: 'Assign User Roles'
  },
  {
    path: 'test',
    loadComponent: () => import('./roles-test/roles-test.component').then(c => c.RolesTestComponent),
    title: 'Test Roles API'
  }
];
