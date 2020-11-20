import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeDisplay'
})
export class TimeDisplayPipe implements PipeTransform {

    transform(value: any, ...args: any[]): any {
        if (!value) {
            value = Date.now();
        }

        let time = new Date(value);
        let year = time.getFullYear();
        let date = ('00' + time.getDate()).slice(-2);
        let month = ('00' + (time.getMonth() + 1)).slice(-2);
        let hour = ('00' + time.getHours()).slice(-2);
        let minute = ('00' + time.getMinutes()).slice(-2);
        let second = ('00' + time.getSeconds()).slice(-2);
        return [year, month, date].join('.') + ' ' + [hour, minute, second].join(':');
    }

}
