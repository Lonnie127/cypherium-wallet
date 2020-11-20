import { NgModule } from '@angular/core';
import { AlertComponent } from "./alert/alert.component";
import { InputTextComponent } from "./input-text/input-text.component";
import { InputPasswordComponent } from "./input-password/input-password.component";
import { GeneratePrivatekeyComponent } from "./generate-privatekey/generate-privatekey.component";
import { MyTabsComponent } from "./my-tabs/my-tabs.component";
// import { DirectivesModule } from '../directives/directives.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from "@ngx-translate/core";
import { KeypadComponent } from './keypad/keypad.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
	declarations: [
		AlertComponent,
		InputTextComponent,
		InputPasswordComponent,
		GeneratePrivatekeyComponent,
		MyTabsComponent,
		KeypadComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		IonicModule,
		// DirectivesModule
	],
	exports: [
		AlertComponent,
		InputTextComponent,
		InputPasswordComponent,
		GeneratePrivatekeyComponent,
		MyTabsComponent,
		KeypadComponent,
	]
})
export class ComponentsModule { }
