import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PledgePage } from './pledge.page';
import { ComponentsModule } from '../../../components/components.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: PledgePage
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
    RouterModule.forChild(routes)
  ],
  declarations: [PledgePage]
})
export class PledgePageModule { }
