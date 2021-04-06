import { Component, OnInit } from '@angular/core';
import * as qrcode from "qrcode-generator";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { WalletService } from '../../providers/wallet/wallet.service';

@Component({
    selector: 'app-cph-receive',
    templateUrl: './cph-receive.page.html',
    styleUrls: ['./cph-receive.page.scss'],
})
export class CphReceivePage implements OnInit {
    qrcode = "";
    wallet: any = "";
    addr = '';
    bech32address = '';

    constructor(
        private router: Router,
        private clipboard: Clipboard,
        private helper: HelperService,
        public global: GlobalService,
        public nav: NavController,
        private storage: Storage,
        private ws: WalletService,

    ) {


    }

    // back() {
    //     this.nav.navigateBack('/wallet');
    // }

    ngOnInit() {
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        this.makeQrcode();
    }

    async copyAddr() {
        this.clipboard.copy(this.wallet.addr);
        let error = await this.helper.getTranslate('COPY_WALLET_SUCCEED');
        this.helper.toast(error);
    }

    makeQrcode() {
        console.log("addr", this.wallet.addr)
        this.wallet.bech32address = this.ws.toBech32Address(this.wallet.addr);
        console.log("bech32address", this.wallet.bech32address)
        this.qrcode = "cph://account/transfer/" + this.wallet.bech32address;
    }

}
