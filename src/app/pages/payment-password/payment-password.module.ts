import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from "@ngx-translate/core";
import { PaymentPasswordPage } from './payment-password.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentPasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentPasswordPage]
})
export class PaymentPasswordPageModule {}
