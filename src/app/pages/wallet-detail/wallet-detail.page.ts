import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../providers/global/global.service';
import { HttpService } from '../../providers/http/http.service';
import { Web3Service } from '../../providers/web3c/web3c.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { HelperService } from '../../providers/helper/helper.service';
import { NativeService } from '../../providers/native/native.service';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-wallet-detail',
    templateUrl: './wallet-detail.page.html',
    styleUrls: ['./wallet-detail.page.scss'],
})
export class WalletDetailPage implements OnInit {
    allTransactionList = [];
    pageno = 1;
    pageSize = 20;
    type = 0;
    wallet: any = {};
    amount: any = "";
    amountInOther: any = "";
    amountInOtherDisplay: any = "";
    blockHeight: any = "";
    more = true;
    loading = false;
    interval = null;
    ifShowPasswordPrompt = false;
    cancelPrompt = null;
    confirmPrompt = null;

    constructor(
        private global: GlobalService,
        private http: HttpService,
        private web3c: Web3Service,
        private helper: HelperService,
        private native: NativeService,
        public nav: NavController,
        private router: Router
    ) { 
        this.wallet = this.global.gWalletList[this.global.currentWalletIndex];
        console.log("wallet:" + JSON.stringify(this.wallet));
        this.amount = this.wallet.amount || 0;
        this.getWalletInfo(this.wallet.addr);
        this.interval = setInterval(() => {
            this.getWalletInfo(this.wallet.addr);
        }, 10000);
    }

    ngOnInit() {

    }
    // back() {
    //     this.nav.navigateBack('/wallet');
    // }
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

    async ionViewDidEnter() {
        // this.blockHeight = await this.web3c.getBlockHeight();
        this.getTransactionList();
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
            let amountInOtherInterger = Math.floor(this.amountInOther);
            let mod = Math.floor(Math.pow(10, value.significand));
            let amountInOtherFraction: any = Math.floor(this.amountInOther * mod) % mod;
            amountInOtherFraction = amountInOtherFraction + "";
            while (amountInOtherFraction.length < value.significand) {
                amountInOtherFraction = amountInOtherFraction + '0';
            }
            this.amountInOtherDisplay = amountInOtherInterger + '.' + amountInOtherFraction;
        })
    }

    goTransferPage() {
        this.router.navigate(['cph-send']);
    }

    goReceivePage() {
        this.router.navigate(['cph-receive']);
    }

    async getTransactionList() {
        let pledge = await this.helper.getTranslate('PLEDGE_CONTRACT_MINING'),
            drawback = await this.helper.getTranslate('DRAWBACK_CONTRACT_MINING');
        let finished = await this.helper.getTranslate('FINISHED');

        this.loading = true;
        // Get a list of trades
        let url = this.global.api['getTransList'];
        console.log("getTransList：",this.wallet.addr);
        return this.http.post(url, {
            addr: '0x' + this.wallet.addr.replace('0x', ''),
            txType: this.type,
            pageIndex: this.pageno,
            pageSize: this.pageSize
        }).subscribe(res => {
            this.loading = false;
            if (res.err_no == 0) {
                this.blockHeight = this.web3c.getBlockHeight();
                if (res.transactions) {
                    res.transactions.forEach(item => {
                        if (item.tx_type == 1 || item.tx_type == 2) {
                            item.displayValue = this.web3c.web3c.fromWei(item.value, 'cpher');
                        } else {
                            item.displayValue = this.web3c.web3c.fromWei(item.tx_type_ext, 'cpher');
                        }
                        let height = this.blockHeight - item.block_number;
                        if (item.block_number == -2) {
                            item.blockHeight = "pending";
                        } else if (height < 1) {
                            item.blockHeight = height + "/1";
                        } else {
                            item.blockHeight = finished;
                        }
                        if (item.tx_type == 3) {
                            item.to = pledge;
                        } else if (item.tx_type == 4) {
                            item.to = drawback;
                        }
                    })
                    // process sent to same adddress
                    let transactionsRes = [];
                    res.transactions.forEach(item => {
                        if (item.tx_type === 1 && item.from === item.to && this.type === 2) {
                            item.tx_type = 2;
                        } else if (item.tx_type === 1 && item.from === item.to && this.type === 0) {
                            let newItem = Object.assign({}, item);
                            newItem.tx_type = 2;
                            transactionsRes = transactionsRes.concat(newItem);
                        }
                        transactionsRes = transactionsRes.concat(item);
                    });

                    if (this.pageno === 1) {
                        this.allTransactionList = transactionsRes || [];
                    } else {
                        this.allTransactionList = this.allTransactionList.concat(transactionsRes || []);
                    }
                    // this.more = (this.allTransactionList.length < res.count);
                    if (Object.keys(res.transactions).length == this.pageSize) {
                        this.more = true;
                    }else {
                        this.more = false;  
                    }
                    console.log(this.allTransactionList.length, res.count);
                } else {
                    if (this.pageno > 1) {
                        this.pageno--;
                    }else {
                        this.allTransactionList = [];
                    }
                    this.more = false;

                }
            }
            this.getWalletInfo(this.wallet.addr);
        }, e => {
                this.loading = false;
                //this.helper.toast("Network error. Please try again.");
        });
    }

    goResultPage(transaction) {
        let navigationExtras = {
            state: {
                tx: transaction.tx_hash,
                status: 0, //0- success, 1: packed, 2: failure
                time: transaction.timestamp / 1000000
            }
        };
        if (transaction.blockHeight === "pending") {
            navigationExtras.state.status = 1;
        }
        // Go to the transaction results page
        this.router.navigate(['transaction-result'], navigationExtras);
    }

    toggleType(type) {
        //update 
        this.getWalletInfo(this.wallet.addr);

        if (this.type != type) {
            this.type = type;
            this.pageno = 1;
            this.getTransactionList();
        }
    }

    async getMore(infiniteScroll) {
        if (!this.more) {
            infiniteScroll.target.complete();
            return false;
        }
        this.pageno++;
        // this.loading = true;
        await this.getTransactionList();
        // this.loading = false;
        infiniteScroll.target.complete();

    }

}
