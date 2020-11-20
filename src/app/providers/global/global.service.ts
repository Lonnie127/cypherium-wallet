import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})

// let projectName = 'CPH'
export class GlobalService {
    public gWalletList = [];
    vibrationDuration = 100;
    paymentPassword = "";
    walletName = "";
    currentWalletIndex = -1;
    maxWalletNum = 20;
    selectedRate: any = {};
    provider = "";
    public gOneSignal: any;
    
    // currentWallet = {};

    static errorCode = {};
    static showLog = false;
    static projectName = "CPH";

    projectName = GlobalService.projectName;

    settings: any = {
        valueUnit: 'USD',
        language: 'en'
    };

    api = {
        'getRateInfo': `/${GlobalService.projectName.toLowerCase()}/get_exchange_rate`,
        'getProvider': `/${GlobalService.projectName.toLowerCase()}/get_provider`,
        "getTransList": "/transaction/get_by_addr_and_type",
    }

    errorKey = {
        10001: 'VERIFYCODEERROR',
    }

    constructor(
        private storage: Storage
    ) { }
}
