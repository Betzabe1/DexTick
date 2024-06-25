import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAgentsPageRoutingModule } from './register-agents-routing.module';

import { RegisterAgentsPage } from './register-agents.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterAgentsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterAgentsPage]
})
export class RegisterAgentsPageModule {}
