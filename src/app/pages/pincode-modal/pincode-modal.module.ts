import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PincodeModalPage } from './pincode-modal.page';
import { ComponentsModule } from '../../components/components.module';
// import { KeypadComponent } from '../../components/keypad/keypad.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from "@ngx-translate/core";
const routes: Routes = [
  {
    path: '',
    component: PincodeModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    TranslateModule,
    // KeypadComponent,
    // RouterModule.forChild(routes)
  ],
  entryComponents: [
    PincodeModalPage,
  ],
  declarations: [PincodeModalPage]
})
export class PincodeModalPageModule {}
