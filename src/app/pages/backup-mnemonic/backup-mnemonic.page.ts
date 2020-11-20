import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GlobalService } from '../../providers/global/global.service';
import { HelperService } from '../../providers/helper/helper.service';
import { Storage } from '@ionic/storage';
import { Platform, NavController } from '@ionic/angular';

@Component({
    selector: 'app-backup-mnemonic',
    templateUrl: './backup-mnemonic.page.html',
    styleUrls: ['./backup-mnemonic.page.scss'],
})
export class BackupMnemonicPage implements OnInit {
    mnemonicList = [];
    backupList = [];
    wallet;

    constructor(
        private router: Router,
        private global: GlobalService,
        private storage: Storage,
        private helper: HelperService,
        private navCtrl: NavController,
        public activeRouter: ActivatedRoute,
    ) {
        if (this.router.getCurrentNavigation().extras.state) {
            this.wallet = this.router.getCurrentNavigation().extras.state.wallet;

            console.log(this.wallet.mnemonic)
            //get mnemonic
            let mnemonicList = this.wallet.mnemonic.split(" ");
            this.mnemonicList = this.shuffle(mnemonicList);
        }
    }

    shuffle(arr) {
        function randomsort(a, b) {
            return Math.random() > .5 ? -1 : 1;
        }
        arr.sort(randomsort);
        return arr;
    }

    ngOnInit() {
    }

    selectMnemonic(mnemonic, i) {
        // let index = this.backupList.indexOf(mnemonic);
        let index = this.isSelect(mnemonic, i);
        if (index > -1) {
            this.backupList.splice(index, 1);
        } else {
            this.backupList.push({mnemonic,i});
        }
        console.log(this.backupList)
    }
    
    isSelect(mnemonic, i){
        return this.backupList.findIndex(item => item.mnemonic === mnemonic && item.i === i);
    }

    async verifyNmemonic() {
        console.log("start verify...", this.mnemonicList, this.backupList);
        let flag = true;
        let mnemonicList = this.wallet.mnemonic.split(' ');
        for (let i = 0; i < mnemonicList.length; i++) {
            if (mnemonicList[i] != this.backupList[i].mnemonic) {
                flag = false;
                break;
            }
        }

        if (flag) {
            if (this.global.walletName) {
                this.wallet.name = this.global.walletName;
            }
            this.helper.addWallet(this.wallet, this.global.paymentPassword);
            this.global.walletName = "";
            //To the home page
            let navigationExtras: NavigationExtras = {
                state: {
                    privateKey: this.wallet.privateKey,
                    action: 'create'
                }
            };
            this.navCtrl.navigateRoot('wallet', navigationExtras);
        } else {
            let error = await this.helper.getTranslate('MNEMONIC_WRONG');
            this.helper.toast(error);
            this.backupList = [];
        }
    }

}
