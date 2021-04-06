import { Pipe, PipeTransform } from '@angular/core';
import { WalletService } from '../../providers/wallet/wallet.service';
import {validation} from 'cypheriumjs-crypto';
import {Router} from '@angular/router';
import {HelperService} from '../../providers/helper/helper.service';
import {GlobalService} from '../../providers/global/global.service';
import {Storage} from '@ionic/storage';
import {Web3Service} from '../../providers/web3c/web3c.service';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {NativeService} from '../../providers/native/native.service';
import {FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
@Pipe({
    name: 'addCphEllipsis'
})
export class AddCphEllipsisPipe implements PipeTransform {
    constructor(
        private ws: WalletService) {}
    transform(value: any, ...args: any[]): any {
        if (!value) {
            return '';
        }
        value = value.replace('0x', '');
        if (value.toString().length <= validation.ADDRESS_LENGTH) {
            console.log("value",value)
            const bech32addr = this.ws.toBech32Address(value)
            return bech32addr.slice(0, 10) + '...' + bech32addr.slice(-10);
        } else {
            return value.slice(0, 10) + '...' + value.slice(-10);
        }
    }



}
