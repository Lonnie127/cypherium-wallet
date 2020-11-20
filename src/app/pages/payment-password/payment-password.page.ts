import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../providers/helper/helper.service';
import { GlobalService } from '../../providers/global/global.service';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-password',
  templateUrl: './payment-password.page.html',
  styleUrls: ['./payment-password.page.scss'],
})
export class PaymentPasswordPage implements OnInit {
  password = "";
  password1 = "";
  password2 = "";
  isChange = false;
  ifEyeOpen = false;
  ifEyeOpen1 = false;
  ifEyeOpen2 = false;

  passwordError = "";
  passwordError1 = "";
  passwordError2 = "";

  ifShowLoading = false;

  wallet: any = {};
  privateKey: any;
  action: any;

  constructor(
    private helper: HelperService,
    private navCtrl: NavController,
    private global: GlobalService,
    private router: Router,
  ) { 
    let state = this.router.getCurrentNavigation().extras.state;
    if (state) {
      this.privateKey = state.privateKey;
      this.action = state.action;
    }
  }

  ngOnInit() {
    this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
  }

  toggleEyeOpen() {
    this.ifEyeOpen = !this.ifEyeOpen;
  }

  toggleEyeOpen1() {
    this.ifEyeOpen1 = !this.ifEyeOpen1;
  }

  toggleEyeOpen2() {
    this.ifEyeOpen2 = !this.ifEyeOpen2;
  }

  async checkPassword() {
    this.passwordError = "";
    if (!this.password) {
      let error = await this.helper.getTranslate('ORIGINAL_PASSWORD_EMPTY');
      this.passwordError = error;
    }
  }

  async checkPassword1() {
    this.passwordError1 = "";
    if (!this.password1) {
      let error = await this.helper.getTranslate('NEW_PASSWORD_EMPTY');
      this.passwordError1 = error;
    } else if (!/^\d{6}$/.test(this.password1)) {
      let error = await this.helper.getTranslate('PAYMENT_PASSWORD_RULE');
      this.passwordError1 = error;
    }
  }

  async checkPassword2() {
    this.passwordError2 = "";
    if (!this.password2) {
      let error = await this.helper.getTranslate('NEW_PASSWORD_EMPTY');
      this.passwordError2 = error;
    } else if (this.password2 != this.password1) {
      let error = await this.helper.getTranslate('PASSEORD_DIFFERENT');
      this.passwordError2 = error;
    }
  }

  async changePassword() {
    if (this.isChange) {
      await this.checkPassword();
      if (this.passwordError) {
        return;
      }
    }

    await this.checkPassword1();
    if (this.passwordError1) {
      return;
    }

    await this.checkPassword2();
    if (this.passwordError2) {
      return;
    }

    this.ifShowLoading = true;

    setTimeout(async () => {
        this.ifShowLoading = false;
        if (this.privateKey) {
          let keystore = this.helper.exportKeystore(this.privateKey, this.password1);
          this.wallet.payment = keystore;
          this.helper.saveWallet();
          setTimeout(async () => {
            let error = await this.helper.getTranslate('CHANGE_PASSWORD_SUCCEED');
            this.helper.toast(error);
          }, 50);
          setTimeout(() => {
            if (this.action !== 'create') {
              this.navCtrl.pop();
            } else {
              this.navCtrl.navigateRoot('wallet');
            }

          }, 1000);
        } else {
          this.ifShowLoading = false;
          let error = await this.helper.getTranslate('PASSWORD_ERROR');
          // this.passwordError = error;
          this.helper.toast(error);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 1000);
        }
    }, 50);
  }

}
