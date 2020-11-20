import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CphSendPage } from './cph-send.page';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";
import { PincodeModalPageModule } from '../pincode-modal/pincode-modal.module';

const routes: Routes = [
  {
    path: '',
    component: CphSendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ComponentsModule,
    TranslateModule,
    PincodeModalPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CphSendPage]
})
export class CphSendPageModule { }
