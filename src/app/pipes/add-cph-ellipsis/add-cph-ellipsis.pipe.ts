import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'addCphEllipsis'
})
export class AddCphEllipsisPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        console.log(value)
        if (!value) {
            return '';
        }
        value = value.replace('0x', '');
        return 'CPH' + value.slice(0, 8).toUpperCase() + '...' + value.slice(-8).toUpperCase();
    }

}
