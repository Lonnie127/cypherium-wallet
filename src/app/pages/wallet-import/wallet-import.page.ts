import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { WalletService } from '../../providers/wallet/wallet.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import {util} from 'cypheriumjs-crypto';

@Component({
    selector: 'app-wallet-import',
    templateUrl: './wallet-import.page.html',
    styleUrls: ['./wallet-import.page.scss'],
})
export class WalletImportPage implements OnInit {
    mnemonic = "";
    private = "";
    password = "";
    password1 = "";
    passwordError = "";
    passwordError1 = "";
    ifEyeOpen1 = false;
    ifEyeOpen = false;
    mnemonicError = "";
    privateError = "";
    type = 'mnemonic';
    keystore = "";
    keystoreError = "";
    rate = 0;
    ifShowLoading = false;

    constructor(
        private router: Router,
        private helper: HelperService,
        private global: GlobalService,
        private navCtrl: NavController,
        private keyboard: Keyboard,
        public Wallet: WalletService,
    ) { }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    toggleEyeOpen1() {
        this.ifEyeOpen1 = !this.ifEyeOpen1;
    }

    toggleImportType(type) {
        this.mnemonic = "";
        this.private = "";
        this.password = "";
        this.password1 = "";
        this.passwordError = "";
        this.passwordError1 = "";
        this.ifEyeOpen1 = false;
        this.ifEyeOpen = false;
        this.mnemonicError = "";
        this.privateError = "";
        this.keystore = "";
        this.keystoreError = "";

        this.type = type;
    }

    ngOnInit() {
    }

    async checkMnemonic() {
        if (!this.mnemonic) {
            let error = await this.helper.getTranslate('MNEMONIC_EMPTY');
            this.mnemonicError = error
            return false;
        }

        let mnemonic = this.mnemonic.replace(/^\s+|\s+$/, '');
        let mnemonicList = mnemonic.split(/\s+/);
        if (mnemonicList.length !== 12) {
            let error = await this.helper.getTranslate('MNEMONIC_LENGTH_ERROR');
            this.mnemonicError = error
            return false;
        }

        if(!this.Wallet.validateMnemonic(mnemonic)) {
            let error = await this.helper.getTranslate('MNEMONIC_ERROR');
            this.mnemonicError = error
            return false;
        }
        this.mnemonicError = "";
        return true;
    }

    async checkPrivate() {
        if (!this.private || this.private.replace(/^\s+|\s+$/, '').length !== 128) {
            let error = await this.helper.getTranslate('PRIVATE_EMPTY');
            this.privateError = error;
            return false;
        }
        if (!util.verify(this.private.replace(/^\s+|\s+$/, ''))) {
            let error = await this.helper.getTranslate('PRIVATE_ERROR');
            this.privateError = error;
            return false;
        }
        this.privateError = "";
        return true;
    }

    async checkKeystore() {
        if (!this.keystore) {
            let error = await this.helper.getTranslate('KEYSTORE_EMPTY');
            this.keystoreError = error
            return false;
        }
        if (!this.helper.validateKeystore(this.keystore)) {
            let error = await this.helper.getTranslate('KEYSTORE_FILE_ERROR');
            this.keystoreError = error;
            return false;
        }
        this.keystoreError = "";
        return true;
    }

    async checkPassword() {
        //Set rules for passwords that are compatible with older versions
        if (this.type == 'keystore') {
            if (!this.password) {
                let message = await this.helper.getTranslate('PASSWORD_EMPTY');
                this.passwordError = message
                return;
            } 
            this.passwordError = "";
            return this.passwordError;
        }
        let regx = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
        if (this.password.match(regx) == null) {
            let message = await this.helper.getTranslate('PASSWORD_RULE');
            this.passwordError = message
            return;
        }
        this.passwordError = "";
        return this.passwordError;
    }

    async checkPassword1() {
        if (this.password1 != this.password) {
            let message = await this.helper.getTranslate('PASSEORD_DIFFERENT');
            this.passwordError1 = message
            return
        }
        this.passwordError1 = "";
        return this.passwordError1;
    }

    async importKeystore() {
        let json = this.keystore;

        console.log("showloading...");
        this.ifShowLoading = true;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 50);
        }).then(async () => {
            let wallet = this.helper.decryptPrivateKey(this.keystore, this.password);
            setTimeout(() => {
                this.ifShowLoading = false;
            }, 0);
            if (wallet.flag) {
                this.keystoreError = "";
                return wallet;
            } else {
                let error = await this.helper.getTranslate('KEYSTORE_ERROR');
                this.keystoreError = error;
                return null;
            }
        })
    }

    importMnemonicWallet() {
        let mnemonic = this.mnemonic.replace(/^\s+|\s+$/, '');
        mnemonic = mnemonic.replace(/\s{2,}/g, ' '); // Replace multiple Spaces with one space
        let wallet = this.Wallet.fromMnemonic(mnemonic);
        return wallet;
    }

    importPrivateKeyWallet() {
        let privateKey = this.private.replace(/^\s+|\s+$/, '').replace(/[\r\n]/g, '');
        let wallet = this.Wallet.fromPrivateKey(privateKey);
        return wallet;
    }

    async importWallet() {
        let check = true;
        if (await this.checkPassword() !== '') {
            check = false;
        }

        if (this.type === 'mnemonic') {
            if (await this.checkMnemonic() !== true) {
                check = false;
            }
            if (await this.checkPassword1() !== '') {
                check = false;
            }
        } else if (this.type === 'private') {
            if (await this.checkPrivate() !== true) {
                check = false;
            }
            if (await this.checkPassword1() !== '') {
                check = false;
            }
        } else {
            if (await this.checkKeystore() !== true) {
                check = false;
            }
        }
        if (!check) {
            return;
        }

        let wallet;

        new Promise((resolve, reject) => {
            if (this.type === 'mnemonic') {
                wallet = this.importMnemonicWallet();
                resolve(wallet);
            } else if (this.type === 'keystore') {
                this.importKeystore().then(resolve)
            } else if (this.type === 'private') {
                wallet = this.importPrivateKeyWallet();
                resolve(wallet);
            }
        }).then(async (wallet: any) => {
            if (!wallet) {
                let error = await this.helper.getTranslate('WALLET_IMPORT_FAILED');
                this.keystoreError = this.keystoreError || error;
                this.mnemonicError = this.mnemonicError || error;
                return;
            }
            console.log("Wallet import succeed...", wallet);
            //Check for duplicates in wallets
            let found = this.global.gWalletList.find(item => item.addr === wallet.address);
            if (found) {
                if (this.type === 'keystore') {
                    let error = await this.helper.getTranslate('KEYSTORE_REPLICATE');
                    this.keystoreError = error;
                } else if (this.type === 'mnemonic') {
                    let error = await this.helper.getTranslate('MNEMONIC_REPLICATE');
                    this.mnemonicError = error;
                } else {
                    // this.type === 'private'
                    let error = await this.helper.getTranslate('MNEMONIC_REPLICATE');
                    this.privateError = error;
                }
                return;
            }
            this.helper.addWallet(wallet, this.password);
            let navigationExtras: NavigationExtras = {
                state: {
                    privateKey: wallet.privateKey,
                    action: 'create'
                }
            };
            this.navCtrl.navigateRoot('wallet', navigationExtras);
        })
    }

    hideKeyboard(e) {
        if (e && (e.key === "Enter" || e.key === "Return")) {
            this.keyboard.hide();
        }
    }

}
