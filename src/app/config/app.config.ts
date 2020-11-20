import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GlobalService } from '../providers/global/global.service';
import { HelperService } from '../providers/helper/helper.service';
import { NativeService } from '../providers/native/native.service';
@Injectable()
export class AppConfig {

  constructor(private http: HttpClient,
    private global: GlobalService,
    private helper: HelperService,
    public native: NativeService
    ) {

  }

    load() {
        return new Promise((resolve) => {
            this.http
              .get(environment.appServerUrl + this.global.api['getProvider'])
              .pipe(map(value=>value))
              .subscribe((data: any) => {
                  this.global.provider = 'http://' + data.providers[0].ip;;
                resolve(true);
              },(error) =>{
                   // this.helper.toast('Please check the network connection');
                    resolve(false);
              });
              ;
          });
    }
}
