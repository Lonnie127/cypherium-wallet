import { Component, OnInit } from '@angular/core';
import * as qrcode from "qrcode-generator";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-cph-receive',
    templateUrl: './cph-receive.page.html',
    styleUrls: ['./cph-receive.page.scss'],
})
export class CphReceivePage implements OnInit {
    qrcode = "";
    wallet: any = "";
    addr = '';

    constructor(
        private router: Router,
        private clipboard: Clipboard,
        private helper: HelperService,
        public global: GlobalService,
        public nav: NavController,
        private storage: Storage,
    ) { }

    // back() {
    //     this.nav.navigateBack('/wallet');
    // }

    ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        this.makeQrcode();
    }

    async copyAddr() {
        this.clipboard.copy(this.addr);
        let error = await this.helper.getTranslate('COPY_WALLET_SUCCEED');
        this.helper.toast(error);
    }

    makeQrcode() {
        // var qr = qrcode(16, "L");
        let addr = this.helper.convertAddr(this.wallet.addr);
        this.addr = addr;
        this.qrcode = "cph://account/transfer/" + 'cph'+ this.wallet.addr;
        // this.addr = addr;
        // qr.addData(addr);
        // qr.make();
        // this.qrcode = qr.createImgTag();
    }

}
