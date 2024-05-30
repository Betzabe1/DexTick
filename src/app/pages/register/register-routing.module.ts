import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPage } from './register.page';
import { LoginPage } from '../login/login.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  },
  {
    path:'login',
    component:LoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
