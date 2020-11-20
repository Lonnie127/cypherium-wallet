import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'coinDisplay'
})
export class CoinDisplayPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        value = +value;
        let interger = Math.floor(value);
        let fraction = Math.floor(value * 100000000) % 100000000;
        let f = ('00000000' + fraction).slice(-8);
        console.log(value, interger, fraction, f);
        return interger + '.' + f;
    }

}
