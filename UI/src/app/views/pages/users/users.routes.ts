import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./users-list/users-list.component').then(c => c.UsersListComponent),
    title: 'Users List'
  },
  {
    path: 'add',
    loadComponent: () => import('./user-form/user-form.component').then(c => c.UserFormComponent),
    title: 'Add User'
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./user-form/user-form.component').then(c => c.UserFormComponent),
    title: 'Edit User'
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./user-details/user-details.component').then(c => c.UserDetailsComponent),
    title: 'User Details'
  },
  {
    path: 'roles',
    loadComponent: () => import('./user-roles/user-roles.component').then(c => c.UserRolesComponent),
    title: 'User Roles'
  }
] as Routes;