import { NgModule } from '@angular/core';
import { AddCphEllipsisPipe } from "./add-cph-ellipsis/add-cph-ellipsis.pipe";
import { CoinDisplayPipe } from './coin-display/coin-display.pipe';
import { TimeDisplayPipe } from './time-display/time-display.pipe';

@NgModule({
	declarations: [AddCphEllipsisPipe, CoinDisplayPipe, TimeDisplayPipe],
	imports: [],
	exports: [AddCphEllipsisPipe, CoinDisplayPipe, TimeDisplayPipe]
})
export class PipesModule { }
