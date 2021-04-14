import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Web3Service } from "../../providers/web3c/web3c.service";
import { NativeService } from "../../providers/native/native.service";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { NavController } from '@ionic/angular';
import {validation } from 'cypheriumjs-crypto';
import { WalletService } from '../../providers/wallet/wallet.service';
@Component({
    selector: 'app-transaction-result',
    templateUrl: './transaction-result.page.html',
    styleUrls: ['./transaction-result.page.scss'],
})
export class TransactionResultPage implements OnInit {
    status = 0;
    tx = "";
    detail: any = {};
    miningFee: any = '';
    time = '';
    wallet: any = "";

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private web3c: Web3Service,
        private ws: WalletService,
        public global: GlobalService,
        private helper: HelperService,
        public nav: NavController,
        private native: NativeService

    ) {
        let state = this.router.getCurrentNavigation().extras.state;
        if (state) {
            this.status = state.status || 0;
            this.tx = state.tx || "";
            this.time = state.time || Date.now();

            if (this.tx) {
                this.getDetailByTx();
            }
        }
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
    }

    async getDetailByTx() {
        this.detail = await this.web3c.getTxDetail(this.tx);
        console.log("Transaction detail：" + JSON.stringify(this.detail));
        this.miningFee = this.detail.gas * this.detail.gasPrice;
        this.detail.from = this.detail.from;
        this.detail.to = this.detail.to;
        // this.detail.from = this.detail.senderKey.replace(/^0x/, 'cph');
        // this.detail.to = this.detail.to.replace(/^0x/, 'cph');
    }

    goHashPage() {
        this.helper.getTranslate('COMING_SOON').then(msg => {
            this.helper.toast(msg);
        });
        // if (this.status != 1) {
        //     let url = "http://scan.cph.com/#/txhash/" + this.tx;
        //     this.native.openUrlBySystemBrowser(url);
        // }
    }

    back() {
        this.nav.navigateBack('/wallet-detail');
        // this.nav.pop().then(() => this.nav.pop());
    }

    goHash(hash) {
        console.log('hash',hash)
        this.helper.toast('0x' + hash.replace('0x', ''));
        // this.helper.getTranslate('COMING_SOON').then(msg => {
        //     this.helper.toast(msg);
        // });
        // if (this.status != 1) {
        //     let url = "http://scan.cph.com/#/txhash/" + this.tx;
        //     this.native.openUrlBySystemBrowser(url);
        // }
    }

    goAddress(addr) {
        this.helper.toast(this.ws.toBech32Address(addr));
        // this.helper.getTranslate('COMING_SOON').then(msg => {
        //     this.helper.toast(msg);
        // });
        // if (this.status != 1) {
        //     let url = "http://scan.cph.com/#/address/" + addr;
        //     this.native.openUrlBySystemBrowser(url);
        // }
    }

    goHeight(height) {
        this.helper.getTranslate('COMING_SOON').then(msg => {
            this.helper.toast(msg);
        });
        // if (this.status != 1) {
        //     let url = "http://scan.cph.com/#/block/" + height;
        //     this.native.openUrlBySystemBrowser(url);
        // }
    }

    ngOnInit() {

    }


}
