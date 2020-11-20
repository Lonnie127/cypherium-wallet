import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../providers/global/global.service';
import { HelperService } from '../../../providers/helper/helper.service';
import { Web3Service } from '../../../providers/web3c/web3c.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HttpService } from "../../../providers/http/http.service";
import { NativeService } from '../../../providers/native/native.service';
import { Events, NavController } from '@ionic/angular';
import { NgZone } from "@angular/core";

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.page.html',
    styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
    ifShowAlert = false;
    ifShowWalletList = false;
    wallet: any = {};
    amount = 0;
    amountInOther: any = '';
    amountInOtherInterger: any = '';
    amountInOtherFraction: any = '';
    amountInOtherDisplay: any = '';
    alertTitle = "";
    alertDesc = "";
    needIndex: any;

    ifShowPasswordPrompt = false;
    cancelPrompt = null;
    confirmPrompt = null;
    interval = null;
    
    constructor(
        private router: Router,
        private helper: HelperService,
        public global: GlobalService,
        private web3c: Web3Service,
        private http: HttpService,
        private storage: Storage,
        private native: NativeService,
        private events: Events,
        private zone: NgZone,
        private navCtrl: NavController,
    ) {
        console.log("Wallet constructor...");
    }

    ngOnInit() {
        console.log("Wallet ngoninit..");
    }

    async ionViewDidEnter() {
        console.log("wallet ngoninit +++++++++...");
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex || 0] || {};
        console.log(this.wallet);
        this.amount = this.wallet.amount || 0;
        this.computeValue();
        this.interval = setInterval(() => {
            this.computeValue();
        }, 10000);

    }

    computeValue() {
        this.getWalletInfo(this.wallet.addr);
        //Access to exchange rate information
        this.http.get(this.global.api['getRateInfo']).subscribe(res => {
            console.log("Exchange rate:", res.rates);
            let unit = this.global.settings.valueUnit || "USD";

            let value = res.rates.find(item => item.currency == unit);
            if (!value) {
                value = res.rates[0];
            }
            this.global.selectedRate = value;
            // Calculate an estimate of the current amount
            this.amountInOther = this.amount * value.rate;
            this.amountInOtherInterger = Math.floor(this.amountInOther);
            let mod = Math.floor(Math.pow(10, value.significand));
            let amountInOtherFraction: any = Math.floor(this.amountInOther * mod) % mod;
            amountInOtherFraction = amountInOtherFraction + "";
            while (amountInOtherFraction.length < value.significand) {
                amountInOtherFraction = amountInOtherFraction + '0';
            }
            this.amountInOtherFraction = amountInOtherFraction;
            this.amountInOtherDisplay = this.amountInOtherInterger + '.' + this.amountInOtherFraction;
        })
    }

    cancelAlert() {
        this.ifShowAlert = false;
    }

    confirmAlert() {
        this.ifShowAlert = false;
        this.native.openSettings('application');
    }

    scan() {
        this.native.scan().then((res: any) => {
            console.log("scan succeed。。。" + JSON.stringify(res));
            // this.handleText(res.text);
            this.helper.handleText(res.text, (url, method) => {
                if (method == 'import') {
                    this.ifShowPasswordPrompt = true;
                    this.cancelPrompt = () => {
                        this.ifShowPasswordPrompt = false;
                    };
                    this.confirmPrompt = () => {
                        this.ifShowPasswordPrompt = false;
                        //Password check successful, start transmission keystore
                        setTimeout(() => {
                            this.http.post(url, {
                                keystore: this.wallet.keystore
                            }, {
                                ignoreError: true
                            }).subscribe(res => {
                                console.log("keystore transferred：" + res);
                            })
                        }, 100);
                    };
                } else if (method == 'transfer') {
                    let navigationExtras: NavigationExtras = {
                        state: {
                            address: url,
                        }
                    };
                    console.log("navigationExtras" + navigationExtras.state.address);
                    this.router.navigate(['cph-send'], navigationExtras);
                }
            })
        })
    }

    goCphSend() {
        this.router.navigate(['cph-send']);
    }

    goCphReceive() {
        this.router.navigate(['cph-receive']);
    }

    confirmCallback() {
        this.ifShowAlert = false;
    }

    addWallet() {
        this.ifShowWalletList = false;
        this.router.navigate(['wallet-create']);
    }

    showWalletList() {
        this.ifShowWalletList = true;
    }

    closeWalletDialog() {
        this.ifShowWalletList = false;
    }

    goWalletDetail() {
        this.router.navigate(['wallet-detail']);
    }

    async copyAddr() {
        console.log("开始拷贝钱包地址....");
        let wallet = 'CPH' + this.wallet.addr.replace('0x', '');
        console.log("Addr:" + wallet);
        this.native.copy(wallet);
        let message = await this.helper.getTranslate('COPY_WALLET_SUCCEED');
        this.helper.toast(message);
    }

    getWalletInfo(addr) {
        this.web3c.getCphBalance(addr, (v) => {
            if (this.amount.toString() !== v.toString() && v !== undefined) {
                this.amount = v;
                this.global.gWalletList[this.global.currentWalletIndex].amount = this.amount;
                this.helper.saveWallet();
            }
        });
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

    toggleWallet(index, wallet) {
        this.ifShowWalletList = false;
        if (this.wallet.name != wallet.name) {
            this.global.currentWalletIndex = index;
            this.storage.set('localwalletindex', this.global.currentWalletIndex);
            //onesignal
            this.global.gOneSignal.sendTag('address', wallet.addr);
            this.wallet = wallet;
            // this.global.currentWallet = wallet;
            this.computeValue();
        }
    }

    deletWallet(index, wallet) {
        this.needIndex = index;
        this.ifShowPasswordPrompt = true;
        this.cancelPrompt = () => {
            this.ifShowPasswordPrompt = false;
        };
        this.confirmPrompt = () => {
            this.ifShowPasswordPrompt = false;
            // 如果账号只有一个或为空，直接删除，然后跳转到创建新账号
            if (this.global.gWalletList.length < 2) {
                this.global.gWalletList.splice(index, 1);
                this.storage.remove('localwallet');
                this.storage.remove('localwalletindex');
                this.navCtrl.navigateRoot('/wallet-create');
            } else {
                // 1.删除列表
                this.global.gWalletList.splice(index, 1);
                this.storage.set('localwallet', JSON.stringify(this.global.gWalletList));
                if (this.wallet.name != wallet.name) {
                    this.global.currentWalletIndex = this.global.gWalletList.indexOf(this.wallet);
                } else {
                    this.global.currentWalletIndex = 0;
                }
                this.storage.set('localwalletindex', this.global.currentWalletIndex);
                this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
                // this.global.currentWallet = wallet;
                this.computeValue();
            }
        };
    }
}
