import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../providers/global/global.service';
import { HelperService } from '../../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Web3Service } from '../../../providers/web3c/web3c.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-pledge',
    templateUrl: './pledge.page.html',
    styleUrls: ['./pledge.page.scss'],
})
export class PledgePage implements OnInit {
    promptDesc = "Enter the security password to confirm the redemption";
    businessType = "pledge";
    businessAmount = "";
    ifShowPasswordPrompt = false;
    walletAmount = "";
    pledgeContractAddr;
    wallet: any = {};
    pledgeAmount: any = "";
    amountError = "";
    paymentPassword = "";
    promptError = "";
    ifShowLoading = false;
    ifEyeOpen = false;
    interval = null;
    times = 1;

    constructor(
        private router: Router,
        // private clipboard: Clipboard,
        private helper: HelperService,
        private global: GlobalService,
        private storage: Storage,
        private web3c: Web3Service
    ) { }

    ngOnInit() {
        this.pledgeContractAddr = environment.cypherium.pledgeContractAddr.replace('0x', '');
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        this.updateWalletInfo();
        this.interval = setInterval(() => {
            this.updateWalletInfo();
        }, 5000);
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    ionViewWillLeave() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    async updateWalletInfo() {
        // this.walletAmount = await this.web3c.getCphBalance(this.wallet.addr);
        this.web3c.getCphBalance(this.wallet.addr, (v) => {
            if (this.walletAmount.toString() !== v.toString() && v !== undefined) {
                this.walletAmount = v;
                this.global.gWalletList[this.global.currentWalletIndex].amount = this.walletAmount;
                this.helper.saveWallet();
            }
        });
        //Obtain the balance of pledge
        this.pledgeAmount = await this.web3c.getMortage(this.wallet.addr);
        this.getTimes();
    }

    cancelPrompt() {
        this.ifShowPasswordPrompt = false;
    }

    confirmPrompt(privateKey) {
        console.log("Private key...", privateKey);
        this.ifShowPasswordPrompt = false;
        this.pledge(privateKey);
    }

    getTimes() {
        let amount = this.pledgeAmount;
        let exp = Math.exp(3 - 0.128 * amount);
        let y = 100 / (1 + exp);
        this.times = y / 4.74;
    }

    async doPledge() {
        this.amountError = "";
        let amount = +this.businessAmount;
        if (!(amount > 0)) {
            if (this.businessType == 'pledge') {
                let message = await this.helper.getTranslate('PLEDGE_AMOUNT_ERROR');

                this.amountError = message;
            } else {
                let message = await this.helper.getTranslate('DRAWBACK_AMOUNT_ERROR');

                this.amountError = message;
            }
            return;
        } else if (!(amount < +this.walletAmount)) {
            if (this.businessType == 'pledge') {
                let message = await this.helper.getTranslate('PLEDGE_AMOUNT_EXCCEED');

                this.amountError = message;
            } else {
                let message = await this.helper.getTranslate('DRAWBACK_AMOUNT_EXCCEED');

                this.amountError = message;
            }
            return;
        }
        this.paymentPassword = "";
        this.promptError = "";
        this.ifShowPasswordPrompt = true;
    }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    async pledge(privateKey) {
        //exe pledge
        let business = this.businessType == 'pledge' ? 'mortgage' : 'redeem';
        this.web3c.pledge(business, this.wallet.addr, +this.businessAmount, privateKey, async (err, result) => {
            this.ifShowLoading = false;
            if (!err) {
                let pledgeSuccess = await this.helper.getTranslate('PLEDGE_SUCCEED'),
                    drawbackSuccess = await this.helper.getTranslate('DRAWBACK_SUCCEED');
                this.helper.toast(this.businessType == 'pledge' ? pledgeSuccess : drawbackSuccess);
                //Update account information
                this.updateWalletInfo();
            } else {
                let pledgeFailure = await this.helper.getTranslate('PLEDGE_FAILURE'),
                    drawbackFailure = await this.helper.getTranslate('DRAWBACK_FAILURE');
                let message = this.businessType == 'pledge' ? pledgeFailure : drawbackFailure;
                if (err.message.toLowerCase().indexOf('insufficient funds for gas') > -1) {
                    let info = await this.helper.getTranslate('BALANCE_INFFICIENT');
                    message = message + ':' + info;
                } else if (err.message.toLowerCase().indexOf('replacement transaction underpriced') > -1) {
                    let info = await this.helper.getTranslate('NONCE_ERROR');
                    message = message + ':' + info
                } else {
                    message = message + ':' + err.message;
                }
                this.helper.toast(message);
            }
        })
    }

    setBusinessType(type) {
        this.businessType = type;
    }

}
