import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el AuthGuard
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),

  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'home-user',
    loadChildren: () => import('./pages/home-user/home-user.module').then( m => m.HomeUserPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'client' }
  },
  {
  path: 'tabs',
  loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
  canActivate: [AuthGuard],
  data: { expectedRole: 'client' }
 },
  {
    path:'perfil',
    loadChildren:()=> import('./pages/perfil/perfil.module').then(m=>m.PerfilPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'client' }
  },
  {
    path: 'tickets-user:id',
    loadChildren: () => import('./pages/tickets-user/tickets-user.module').then( m => m.TicketsUserPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'client' }
  },

  {
    path: 'service-options/:categoryId/:subCategoryId',
        loadChildren: () => import('./pages/service-options/service-options.module').then( m => m.ServiceOptionsPageModule)
  },
  {
    path: 'home-agent',
    loadChildren: () => import('./pages/home-agent/home-agent.module').then( m => m.HomeAgentPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'agent' }
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }

  },
  {
     path: 'tabs-agent',
   loadChildren: () => import('./pages/tabs-agent/tabs-agent.module').then( m => m.TabsAgentPageModule),
   canActivate: [AuthGuard],
   data: { expectedRole: 'agent' }
   },
   {
     path: 'tabs-admin',
  loadChildren: () => import('./pages/tabs-admin/tabs-admin.module').then( m => m.TabsAdminPageModule),
  canActivate: [AuthGuard],
  data: { expectedRole: 'admin' }
   },

  {
    path: 'tickets-agent',
    loadChildren: () => import('./pages/tickets-agent/tickets-agent.module').then( m => m.TicketsAgentPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'agent' }
  },
  {
    path: 'perfil-agent',
    loadChildren: () => import('./pages/perfil-agent/perfil-agent.module').then( m => m.PerfilAgentPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'agent' }
  },
  {
    path: 'perfil-admin',
    loadChildren: () => import('./pages/perfil-admin/perfil-admin.module').then(m => m.PerfilAdminPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
 },


  // Ruta para manejar rutas no encontradas
  // { path: '**', redirectTo: '/login' },

  {
    path: 'crud-users',
    loadChildren: () => import('./pages/crud-users/crud-users.module').then( m => m.CrudUsersPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'editar-user/:id',
    loadChildren: () => import('./pages/editar-user/editar-user.module').then( m => m.EditarUserPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'crud-agent',
    loadChildren: () => import('./pages/crud-agent/crud-agent.module').then( m => m.CrudAgentPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'crud-admin',
    loadChildren: () => import('./pages/crud-admin/crud-admin.module').then( m => m.CrudAdminPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },

  {
    path: 'register-agents',
    loadChildren: () => import('./pages/register-agents/register-agents.module').then( m => m.RegisterAgentsPageModule),
    canActivate: [AuthGuard], data: { expectedRole: 'admin' }
  },
  {
    path: 'register-admin',
    loadChildren: () => import('./pages/register-admin/register-admin.module').then( m => m.RegisterAdminPageModule),
    canActivate: [AuthGuard], data: { expectedRole: 'admin' }

  },
  {
    path: 'register-client',
    loadChildren: () => import('./pages/register-client/register-client.module').then( m => m.RegisterClientPageModule),
    canActivate: [AuthGuard], data: { expectedRole: 'admin' }

  },
  {
    path: 'editar-agents/:id',
    loadChildren: () => import('./pages/editar-agents/editar-agents.module').then( m => m.EditarAgentsPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'editar-admins/:id',
    loadChildren: () => import('./pages/editar-admins/editar-admins.module').then( m => m.EditarAdminsPageModule),
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'servicios-users/:categoryId/:subCategoryId',
        loadChildren: () => import('./pages/servicios-users/servicios-users.module').then( m => m.ServiciosUsersPageModule)
  }






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
