import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { HttpService } from "../../providers/http/http.service";
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-value-unit',
    templateUrl: './value-unit.page.html',
    styleUrls: ['./value-unit.page.scss'],
})
export class ValueUnitPage implements OnInit {
    rateList = [];
    constructor(
        private router: Router,
        public global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private navCtrl: NavController,
        public activeRouter: ActivatedRoute,
        private http: HttpService,
        private httpn: HTTP,
    ) { }

    ngOnInit() {
        this.helper.getTranslate('COMING_SOON').then(msg => {
            this.helper.toast(msg);
        });
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            this.rateList = res.rates;
        });
        // this.httpn.get(environment.appServerUrl + this.global.api['getRateInfo'], {}, {})
        //     .then(data => {

        //         console.log(data.status);
        //         console.log(data.data); // data received by server
        //         console.log(data.headers);
        //         console.log(JSON.parse(data.data));
        //         this.rateList = JSON.parse(data.data).rates;

        //     })
        //     .catch(error => {

        //         console.log(error.status);
        //         console.log(error.error); // error message as string
        //         console.log(error.headers);

        //     });
    }

    toggleValueUnit(unit) {
        if (unit != this.global.settings.valueUnit) {
            this.global.settings.valueUnit = unit;
            this.storage.set('localsetting', JSON.stringify(this.global.settings));
        }
        this.navCtrl.pop();
    }

}
