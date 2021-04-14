import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from '../../providers/helper/helper.service';
import { GlobalService } from '../../providers/global/global.service';


@Component({
    selector: 'app-generate-privatekey',
    templateUrl: './generate-privatekey.component.html',
    styleUrls: ['./generate-privatekey.component.scss'],
})
export class GeneratePrivatekeyComponent implements OnInit {
    ifEyeOpen = false;
    promptError = "";
    paymentPassword: string = "";
    ifShowLoading = false;

    @Input() needIndex: any;
    @Input() cancelText: string = "";
    @Input() confirmText: string = "";
    @Input() promptDesc: string = "";
    @Output() cancel = new EventEmitter<any>();
    @Output() confirm = new EventEmitter<any>();

    constructor(
        private helper: HelperService,
        private global: GlobalService,
    ) { }

    ngOnInit() {
        this.paymentPassword = "";
    }

    toggleEyeOpen() {
        this.ifEyeOpen = !this.ifEyeOpen;
    }

    cancelPrompt() {
        this.cancel.emit();
    }

    async confirmPrompt() {
        let keystore: any;

        if (this.needIndex) {
            keystore = this.global.gWalletList[this.needIndex].keystore;
        }else {
            keystore = this.global.gWalletList[this.global.currentWalletIndex].keystore;
        }

        this.promptError = "";
        if (!this.paymentPassword) {
            let error = await this.helper.getTranslate('PASSWORD_EMPTY');
            this.promptError = error;
            return;
        }
        this.ifShowLoading = true;
        setTimeout(async() => {
            //decode
            let ret = this.helper.decryptPrivateKey(keystore, this.paymentPassword);
            if (ret.flag) {
                this.ifShowLoading = false;
                this.paymentPassword = '';
                this.confirm.emit(ret.privateKey);
                return;
            } else {
                this.ifShowLoading = false;
                let error = await this.helper.getTranslate('PASSEORD_ERROR');
                this.promptError = error;
            }
        }, 100);
    }

}
