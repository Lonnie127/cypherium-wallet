import { Pipe, PipeTransform } from '@angular/core';
import {bech32, validation} from 'cypheriumjs-crypto';
@Pipe({
    name: 'addCphEllipsis'
})
export class AddCphEllipsisPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (!value) {
            return '';
        }
        value = value.replace('0x', '');
        if (value.toString().length <= validation.ADDRESS_LENGTH) {
            const bech32addr = bech32.toBech32Address(value)
            return bech32addr.slice(0, 10) + '...' + bech32addr.slice(-10);
        } else {
            return value.slice(0, 10) + '...' + value.slice(-10);
        }
    }

}
