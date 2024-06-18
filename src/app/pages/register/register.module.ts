import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';
import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  exports:[
    RegisterPage
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
