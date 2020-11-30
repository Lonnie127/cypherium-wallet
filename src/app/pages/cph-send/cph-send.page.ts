import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Web3Service } from '../../providers/web3c/web3c.service';
import { NativeService } from '../../providers/native/native.service';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalController } from '@ionic/angular';
import { PincodeModalPage } from '../pincode-modal/pincode-modal.page';
import { FingerprintAIO ,FingerprintOptions} from '@ionic-native/fingerprint-aio/ngx';

@Component({
    selector: 'app-cph-send',
    templateUrl: './cph-send.page.html',
    styleUrls: ['./cph-send.page.scss'],
})
export class CphSendPage implements OnInit {
    fingerprintOptions : FingerprintOptions;
    range = 18;     //let price = await this.web3c.cph.gasPrice(); price/1e9;
    wallet: any = {};
    amount = 0;
    receiveAddress = "";
    payAmount: any = "";
    min = 1;
    max = 100;
    amountError = "";
    addressError = "";
    ifShowPasswordPrompt = false;
    ifShowAlert = false;
    alertTitle = "";
    alertDesc = "";
    interval = null;

    constructor(
        private router: Router,
        // private clipboard: Clipboard,
        private helper: HelperService,
        private global: GlobalService,
        private storage: Storage,
        private web3c: Web3Service,
        public nav: NavController,
        private platform: Platform,
        private keyboard: Keyboard,
        private native: NativeService,
        public modalController: ModalController,
        public alertController: AlertController,
        private fingerAuth: FingerprintAIO
    ) { 
        let state = this.router.getCurrentNavigation().extras.state;
        if (state) {
            this.receiveAddress = state.address;
        }
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        // if (!this.wallet.payment) {
        //     this.presentAlertConfirm();
        // }
        this.amount = this.wallet.amount || 0;
        this.updateWalletInfo();
        this.interval = setInterval(() => {
            this.updateWalletInfo();
        }, 10000);
    }
    public showFingerprintAuthDlg(){
        this.fingerAuth.isAvailable().then(result =>{
          console.log('showFingerprintAuthDlg'+result)
            this.fingerAuth.show({
              // clientId: 'fingerprint-Demo',
              // clientSecret: 'password', //Only necessary for Android
              // disableBackup:true  //Only for Android(optional)
            //   title:"face id",
            //   subtitle:"face id test",
              description: "Pay with biometric"
          })
            .then((result: any) => console.log('fingerAuth.show'+result))
            .catch((error: any) => console.log('fingerAuth.show error'+error.message));
        }).catch((error: any) => console.log('showFingerprintAuthDlg error'+error.message));
    }
    async presentAlertConfirm() {
        let header = await this.helper.getTranslate('PAYMENT_PASSWORD');
        let message = await this.helper.getTranslate('PAYMENT_PASSWORD_M');
        let comfirm = await this.helper.getTranslate('CONFIRM');
        let cancel = await this.helper.getTranslate('CANCEL');

        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: cancel,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.nav.pop();
                    }
                },
                {
                    text: comfirm,
                    handler: () => {
                        this.router.navigate(['/setting']);
                    }
                }
            ]
        });

        await alert.present();
    }

    // back() {
    //     this.nav.navigateBack('/wallet');
    // }

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
        this.web3c.getCphBalance(this.wallet.addr, (v) => {
            if (this.amount.toString() !== v.toString() && v !== undefined) {
                this.amount = v;
                this.global.gWalletList[this.global.currentWalletIndex].amount = this.amount;
                this.helper.saveWallet();
            }
        });
    }

    async ngOnInit() {
        // console.log(this.global.gWalletList, this.global.currentWalletIndex);
        // get balance
        // let state = this.router.getCurrentNavigation().extras.state;
        // console.log("state" + state)
        // if (state) {
        //     // let obj = state.extras.state;
        //     this.receiveAddress = state.address;
        // }
    }

    scan() {
        this.native.scan().then(async (res: any) => {
            console.log("SCAN RESULT：", res);
            this.helper.handleText(res.text, async (url, method) => {
                if (method == 'transfer') {
                    let result = await this.web3c.isCphAddr(url);
                    if (result == 0) {
                        this.receiveAddress = url;
                    } else {
                        let message = await this.helper.getTranslate('UNKNOWN_RESULT');
                        this.helper.toast(message);
                    }
                }

            })
        }, res => {
            // if (res == 1) {
            //

            // } else if (res == 0) {
            //
            //     this.ifShowAlert = true;
            //     this.alertTitle = "permisson deny";
            //     this.alertDesc = "You have denied camera access, please go to application management open";
            // } else {
            //     this.helper.toast("Sweep code failure");
            // }
        })
    }

    cancelPrompt() {
        this.ifShowPasswordPrompt = false;
    }

    async presentModal() {
        let title = await this.helper.getTranslate('PAYMENT_PASSWORD');
        const modal = await this.modalController.create({
            component: PincodeModalPage,
            cssClass: "pincode-modal",
            componentProps: {
                'title': title,
            }
        });
        await modal.present();
        modal.onDidDismiss().then((s) => {
            if (typeof(s.data) !== 'undefined' && s.data.dismissed !== false) {
                //get private key
                setTimeout(async () => {
                    let ret = this.helper.decryptPrivateKey(this.wallet.payment, s.data.dismissed);
                    if (ret.flag) {
                        this.transfer(ret.privateKey);
                    } else {
                        //password error
                        let error = await this.helper.getTranslate('PAYMENT_PASSWORD_ERROR');
                        this.helper.toast(error);
                    }
                }, 50);
            }
        });
    }

    confirmPrompt(privateKey) {
        console.log("Private key...", privateKey);
        this.ifShowPasswordPrompt = false;
        this.transfer(privateKey);
    }

    cancelAlert() {
        this.ifShowAlert = false;
    }

    confirmAlert() {
        this.ifShowAlert = false;
        this.native.openSettings('application');
    }

    async checkAmount() {
        this.amountError = "";
        let amount = +this.payAmount;
        if (amount <= 0) {
            let message = await this.helper.getTranslate('AMOUNT_ILLEGAL');
            this.amountError = message;
            return;
        }
        if (amount <= 0.0001) {
            let message = await this.helper.getTranslate('AMOUNT_SMALL');
            this.amountError = message;
            return;
        }
        console.log(`${amount}, ${this.range}, ${this.amount}`);
        if (amount + this.range * 21000 / 1000000000 > this.amount) {
            let message = await this.helper.getTranslate('BALANCE_INFFICIENT');
            this.amountError = message;
            return;
        }
    }

    hideKeyboard(e) {
        if (e && (e.key === "Enter" || e.key === "Return")) {
            this.keyboard.hide();
        }
    }

    async checkAddr() {
        this.addressError = "";

        let result = await this.web3c.isCphAddr(this.receiveAddress.toLowerCase());
        if (result == -1) {
            let message = await this.helper.getTranslate('ADDRESS_EMPTY');
            this.addressError = message;
        } else if (result == -2) {
            let message = await this.helper.getTranslate('ADDRESS_ERROR');
            this.addressError = message;
        }
    }

    changeRange(e) {
    }

    async transferConfirm() {
        await this.checkAmount();
        if (this.amountError) {
            return;
        }

        await this.checkAddr();
        if (this.addressError) {
            return;
        }
        //Direct the user to enter a password
         this.ifShowPasswordPrompt = true;

        //Direct the user to enter a payment password PinCode
        // this.presentModal();

        //Guide users to use face recognition or fingerprint recognition
        // this.wallet.isAskForBiometric
        // this.fingerAuth.isAvailable().then(result =>{
        //     console.log('showFingerprintAuthDlg'+result)
        //       this.fingerAuth.show({
        //         // clientId: 'fingerprint-Demo',
        //         // clientSecret: 'password', //Only necessary for Android
        //         // disableBackup:true  //Only for Android(optional)
        //       //   title:"face id",
        //       //   subtitle:"face id test",
        //         description: "Pay with biometric"
        //     })
        //       .then((result: any) => {
        //           console.log('fingerAuth.show'+result);
        //         })
        //       .catch((error: any) => {
        //           console.log('fingerAuth.show error'+error.message);
        //         //Direct the user to enter a password
        //         this.ifShowPasswordPrompt = true;
        //       });
        //   }).catch((error: any) => {
        //       console.log('showFingerprintAuthDlg error'+error.message);
        //     //Direct the user to enter a password
        //     this.ifShowPasswordPrompt = true;
        // });

    }

    async transfer(privatekey) {
        let address = this.receiveAddress.toLowerCase().replace('cph', '0x');
        this.web3c.transferCph(this.wallet.addr, address, this.payAmount, this.range, privatekey, async (err, tx) => {
            console.log("Transaction callback.......", err, tx);
            if (err === null) {
                // resolve(tx);
                // this.helper.toast("transaction success");
                let navigationExtras = {
                    state: {
                        tx: tx,
                        status: 1 //0- success, 1: packed, 2: failure
                    }
                };
                // Go to the transaction results page
                this.router.navigate(['transaction-result'], navigationExtras);
            } else {
                let message = await this.helper.getTranslate('TRANSACTION_FAILED');
                if (err.message.toLowerCase().indexOf('insufficient funds for gas') > -1) {
                    message = await this.helper.getTranslate('BALANCE_INFFICIENT');
                } else if (err.message.toLowerCase().indexOf('replacement transaction underpriced') > -1) {
                    message = await this.helper.getTranslate('NONCE_ERROR');
                } else {
                    message = message + ': ' + err.message;
                }
                this.helper.toast(message)
            }
        })
    }

}
