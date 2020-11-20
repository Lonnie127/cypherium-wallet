import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  static error(err: any, action: string) {
    this.log('Logger.error：', '#f04141', action, '\n ' + err);
  }

  static log(text, color = '#989aa2', ...detail) {
    console.log(`%c${text}`, `background-color: ${color}; color:white; padding: 2px 5px; border-radius: 2px`, ...detail);
  }

  static http(err: any, data) {
    console.log({ ...data }); // upload log
    LoggerService.error(err, 'request error');
  }

}
