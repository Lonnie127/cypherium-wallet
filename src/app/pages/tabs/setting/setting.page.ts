import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../providers/global/global.service';
import { HelperService } from '../../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpService } from "../../../providers/http/http.service";
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../../../environments/environment';
import { Events, NavController } from '@ionic/angular';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
    displayValue: any = {};
    rateList = [];
    ifShowPasswordPrompt = false;
    confirmPrompt = null;
    cancelPrompt = null;

    constructor(
        private router: Router,
        public global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private http: HttpService,
        private httpn: HTTP,
        public activeRouter: ActivatedRoute,
        private navCtrl: NavController,
    ) { }

    ngOnInit() {
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            let unit = this.global.settings.valueUnit;
            this.rateList = res.rates;
        });
        // this.httpn.get(environment.appServerUrl + this.global.api['getRateInfo'], {}, {})
        //     .then(data => {

        //         console.log(data.status);
        //         console.log(data.data); // data received by server
        //         console.log(data.headers);
        //         this.rateList = JSON.parse(data.data).rates;

        //     })
        //     .catch(error => {

        //         console.log(error.status);
        //         console.log(error.error); // error message as string
        //         console.log(error.headers);

        //     });
    }

    getCurrency() {
        if (this.rateList.length > 0) {
            let unit = this.global.settings.valueUnit;
            let value = this.rateList.find(item => item.currency == unit);
            if (!value) {
                value = this.rateList[0];
            }
            return value;
        } else {
            return {
                symbol: "$",
                currency: "USD"
            }
        }
    }

    goSetValueUnitPage() {
        this.router.navigate(['value-unit']);
    }

    goSetLanguagePage() {
        this.router.navigate(['language-toggle']);
    }

    goAboutPage() {
        this.router.navigate(['about']);
    }

    goBrowser() {
        this.helper.getTranslate('COMING_SOON').then(msg => {
            this.helper.toast(msg);
        });
        // window.open('https://cypherium.io');
    }

    goWalletToolPage() {
        this.router.navigate(['wallet-admin']);
    }

    goChangePassword() {
        this.router.navigate(['change-password']);
    }

    goChangePaymentPassword() {
        this.ifShowPasswordPrompt = true;
        this.cancelPrompt = () => {
            this.ifShowPasswordPrompt = false;
        };
        this.confirmPrompt = (prv) => {
            this.ifShowPasswordPrompt = false;
            let navigationExtras: NavigationExtras = {
                state: {
                    privateKey: prv,
                }
            };
            this.router.navigate(['payment-password'], navigationExtras);
        };
    }

}
