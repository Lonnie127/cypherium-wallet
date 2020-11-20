import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pincode-modal',
  templateUrl: './pincode-modal.page.html',
  styleUrls: ['./pincode-modal.page.scss'],
})
export class PincodeModalPage implements OnInit {
  codeViewStyle = 'star'; // star or value
  title;
  Pin: any;
  ifShowPasswordPrompt = false;
  confirmPrompt = null;
  cancelPrompt = null;

  constructor(
    private router: Router,
    private modalCtrl: ModalController) {
  }


  dismiss(s) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': s
    });
  }

  forgotPinCode() {
    this.ifShowPasswordPrompt = true;
    this.cancelPrompt = () => {
      this.ifShowPasswordPrompt = false;
    };
    this.confirmPrompt = (prv) => {
      this.ifShowPasswordPrompt = false;
      let navigationExtras: NavigationExtras = {
        state: {
          privateKey: prv,
        }
      };
      this.router.navigate(['payment-password'], navigationExtras);
      this.dismiss(false);
    };
  }
  eventCapture(event: any) {
    this.Pin = event;
    this.dismiss(this.Pin);

  }

  ngOnInit() {
  }

  onKeyboardButtonClick(key: number) {
    // Log the pressed key
    console.log(key);
  }

}
