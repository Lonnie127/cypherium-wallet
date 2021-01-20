import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { Storage } from "@ionic/storage";
import { GlobalService } from "../global/global.service";

import { Observable } from 'rxjs';
import * as Wallet from 'cypheriumjs-wallet';
import * as cyphers from 'ethers';
import { TranslateService } from "@ngx-translate/core";

// import { Buffer } from 'safe-buffer';

declare var cordova;
declare var window;

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    readonly IsMobile: boolean = false;
    private AlertIsExist = false;
    private LoadingIsExist = false;
    private Loading = null;
    private win: any = window;

    readPermitted = false;

    constructor(public platform: Platform,
        public alertController: AlertController,
        public loadingController: LoadingController,
        private storage: Storage,
        private global: GlobalService,
        private translateService: TranslateService,
        public toastController: ToastController) {
        this.IsMobile = this.platform.is('cordova');

        console.log("Helper construction...IsMobile:"+this.IsMobile);
    }

    addWallet(w, password) {
        if (!w.keystore) {
            w.keystore = JSON.stringify(this.exportKeystore(w.privateKey, password));
        }
        let wallet = {
            // name: w.walletName || this.global.projectName + '-wallet-' + w.address.slice(-4),
            name: w.name || this.global.projectName + '-' + w.address.slice(-4),
            addr: w.address,
            keystore: w.keystore,
        };
        this.global.gWalletList.unshift(wallet);
        this.global.currentWalletIndex = 0;
        this.saveWallet();
    }

    async getTranslate(key) {
        let value: string = await new Promise((resolve, reject) => {
            this.translateService.get(key).subscribe((value) => {
                resolve(value)
            })
        })
        return value;
    }

    async handleText(res, callback) {
        // this.native.scan().then((res: any) => {
        console.log("scan result：" + res);
        if (!res) {
            return;
        }
        res = res.toLowerCase();
        //Gets Scheme, objects, methods, and parameters
        let matches = res.match(/(.+)\:\/\/([^/]+)\/([^/]+)\/([^/]+)/);
        if (!res) {
            return;
        }
        let scheme = matches[1],
            object = matches[2],
            method = matches[3],
            params = matches[4];
        console.log(`scheme:${scheme}, object:${object}, method:${method},params:${params}`);
        if (scheme == 'cph') {
            if (object == 'account') {
                if (method == 'import') {
                    let url = decodeURIComponent(params);
                    callback && callback(url, method);
                } else if (method == 'transfer') {
                    let url = decodeURIComponent(params);
                    console.log("url" + url);
                    callback && callback(url, method);
                }
            }
        }

    }

    saveWallet() {
        // this.currentWallet = w;
        this.storage.set('localwalletindex', this.global.currentWalletIndex);
        //Cache the wallet list, otherwise the wallet will be lost
        this.storage.set('localwallet', JSON.stringify(this.global.gWalletList));
    }

    generateMnemonicWallet(privateKey) {
        let wallet = new cyphers.Wallet(privateKey);
        return wallet;
    }

    exportKeystore(privateKey, password) {
        privateKey = privateKey.replace('0x', '');
        if (typeof privateKey == 'string') {
            privateKey = Buffer.from(privateKey, 'hex');
        }
        console.log(privateKey)
        let wallet = Wallet.fromPrivateKey(privateKey);
        //generate keystore
        let keystore = wallet.toV3(password, {
            n: 1024
        });
        return keystore;
    }

    /**
     * decryptPrivateKey: Restore the wallet according to the keystore and password
     * @param keystore 
     * @param password 
     */
    decryptPrivateKey(keystore, password) {
        let privateKey = null, publicKey = null;
        try {
            let wallet = Wallet.fromV3(keystore, password, true)
            privateKey = wallet.getPrivateKey().toString('hex');
            publicKey = wallet.getPublicKey().toString('hex');
            console.log(privateKey, publicKey)
            if (privateKey) {
                return {
                    flag: true,
                    address: wallet.getAddress(),
                    privateKey: privateKey,
                    publicKey: publicKey,
                    keystore: keystore
                };
            } else {
                return {
                    flag: false
                }
            }
        } catch (e) {
            console.log("catch......");
            return {
                flag: false
            }
        }
    }

    validateKeystore(keystore) {
        try {
            Wallet.validateKeystore(keystore, true);
        }
        catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }




    isMobile(): boolean {
        return this.IsMobile;
    }


    isNotMobile(): boolean {
        return !this.isMobile();
    }


    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }


    assertIsMobile(): void {
        if (this.isNotMobile()) {
            this.toast('Please use real machine debugging');
            throw new Error('Please use real machine debugging');
        }
    }

    convertAddr(addr) {
        return 'CPH' + addr.replace('0x', '');
    }

    /**
     * tip in development
     */
    tipDev() {
        this.toast('in development');
    }


    alert(header = '', message = '', okBackFun = null, cancelBtnFun = null): void {
        // alertController.create is an asynchronous method, so use AlertIsExist to alert if the flag is turned on
        if (this.AlertIsExist) {
            console.log('alert is already exists. Do not open it again');
            setTimeout(() => { // alert is more likely to close than click ok or cancel
                this.AlertIsExist = false;
            }, 10000);
            return;
        }
        this.AlertIsExist = true;
        const buttons = [{
            text: 'confirm', handler: () => {
                this.AlertIsExist = false;
                okBackFun && okBackFun();
            }
        }];
        if (cancelBtnFun) {
            const cancelBtn = {
                text: 'cancel',
                role: 'cancel',
                handler: () => {
                    this.AlertIsExist = false;
                    cancelBtnFun();
                }
            };
            buttons.unshift(cancelBtn);
        }

        console.log('http requset error:' + message);
    }

    hideAlert() {
        this.alertController.dismiss();
        this.AlertIsExist = false;
    }

       /**
        * Display the prompt message
        * It is recommended to call Nativeservice. toast first
        */
    toast(message: string = 'operate success', duration: number = 2500, position: 'top' | 'bottom' | 'middle' = 'bottom'): void {
        const opts = {
            message, duration,
            color: 'dark',
            position,
            showCloseButton: true,
            cssClass: 'toast',
            closeButtonText: '✖'
        };
        this.toastController.create(opts).then(toast => toast.present());
    }


    showLoading(message: string = ''): void {
        if (this.LoadingIsExist) {
            return;
        }
        this.LoadingIsExist = true;
        this.loadingController.create({
            spinner: 'bubbles', // dots https://ionicframework.com/docs/api/spinner
            duration: 50000,
            message
        }).then(loading => {
            // loadingController.create,It is possible that the hideLoading method has been called before calling load.present ()
            if (this.LoadingIsExist) {
                loading.present();
                this.Loading = loading;
            } else {
                loading.dismiss();
            }
        });
    }


    hideLoading(): void {
        this.LoadingIsExist = false;
        if (this.Loading) {
            this.Loading.dismiss();
            this.Loading = null;
        }
    }

}
