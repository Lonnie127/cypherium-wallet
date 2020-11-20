import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { HelperService } from '../helper/helper.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
// import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
// import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Vibration } from "@ionic-native/vibration/ngx";
import { Platform } from '@ionic/angular';
import { GlobalService } from '../global/global.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

declare let ImagePicker;

/**
 * The Cordova plugin (for mobile hardware) calls the toolbar
 */
@Injectable({
    providedIn: 'root'
})
export class NativeService {
    private AppVersionInfo: object = null;

    constructor(private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private appVersion: AppVersion,
        // private socialSharing: SocialSharing,
        private minimize: AppMinimize,
        // private photoLibrary: PhotoLibrary,
        private iab: InAppBrowser,
        private network: Network,
        private vibration: Vibration,
        private qrScanner: QRScanner,
        private global: GlobalService,
        private clipboard: Clipboard,
        private barcodeScanner: BarcodeScanner,
        private openNativeSettings: OpenNativeSettings,
        public helper: HelperService) {
    }

    /**
     * Set the status bar style
     * https://ionicframework.com/docs/native/status-bar
     */
    setStatusBarStyle(): void {
        // if (this.helper.isMobile()) {
        //     // this.statusBar.overlaysWebView(false);
        //     // this.statusBar.styleLightContent();
        //     this.statusBar.styleDefault(); // use black font
        //     this.statusBar.backgroundColorByHexString('#fff'); // Set the background color
        // }
    }

    copy(str) {
        this.clipboard.copy(str);
    }

    /**
     * Hide startup page
     * https://ionicframework.com/docs/native/splash-screen
     */
    hideSplashScreen(): void {
        if (this.helper.isMobile()) {
            this.splashScreen.hide();
        }
    }

    openSettings(setting) {
        this.openNativeSettings.open(setting);
    }

    scan() {
        return this.barcodeScanner.scan({
            showTorchButton: true
        }).then(barcodeData => {
            console.log('Barcode data', barcodeData);
            return barcodeData;
        }).catch(err => {
            console.log('Error', err);
            return {
                text: ''
            }
        });

        // return new Promise((resolve, reject) => {
        //     // Optionally request the permission early
        //     this.qrScanner.prepare()
        //         .then((status: QRScannerStatus) => {
        //             console.log("State authority：" + JSON.stringify(status));
        //             if (status.authorized) {
        //                 console.log("Permission obtained successfully......");
        //                 // camera permission was granted
        //                 // start scanning
        //                 let scanSub = this.qrScanner.scan().subscribe((text: string) => {
        //                     console.log('Scanned something', text);

        //                     this.qrScanner.hide(); // hide camera preview
        //                     scanSub.unsubscribe(); // stop scanning

        //                     resolve(text);
        //                 });

        //             } else if (status.denied) {
        //                 reject(1);
        //                 // camera permission was permanently denied
        //                 // you must use QRScanner.openSettings() method to guide the user to the settings page
        //                 // then they can grant the permission from there
        //             } else {
        //                 reject(0);
        //                 // permission was denied, but not permanently. You can ask for permission again at a later time.
        //             }
        //         })
        //         .catch((e: any) => console.log('Error is', () => {
        //             reject(e);
        //         }));
        // })

    }

    /**
     * minimum app
     */
    appMinimize() {
        this.minimize.minimize();
    }

    /**
     * Open url through the system browser
     */
    openUrlBySystemBrowser(url: string): void {
        this.iab.create(url, '_system');
    }

    /**
     * Get network type,example `unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
     */
    getNetworkType(): string {
        this.helper.assertIsMobile();
        return this.network.type;
    }

    /**
     * Determine if there is a network
     */
    isConnecting(): boolean {
        return this.getNetworkType() !== 'none';
    }


    /**
     * Get the app name, package name, and version number
     * https://ionicframework.com/docs/native/app-version
     */
    getAppVersionInfo() {
        this.helper.assertIsMobile();
        if (this.AppVersionInfo) {
            return of(this.AppVersionInfo);
        }
        const appInfo = {
            appName: '', // app name,Such as field operation
            packageName: '', // app package name /id,examplecom.kit.ionic2tabs
            versionNumber: '', // app version,example0.0.1
            name: '' // ionic2tabs
        };
        return Observable.create(observer => {
            Promise.all([
                this.appVersion.getAppName(),
                this.appVersion.getPackageName(),
                this.appVersion.getVersionNumber()
            ]).then(result => {
                appInfo.appName = result[0];
                appInfo.packageName = result[1];
                appInfo.versionNumber = result[2];
                appInfo.name = result[1].split('.').pop();
                this.AppVersionInfo = appInfo;
                observer.next(appInfo);
            }).catch(err => {
                LoggerService.error(err, 'NativeService.getAppVersionInfo');
                observer.error(false);
            });
        });
    }


    /**
   * To obtain app's version,example0.01
   * @description  corresponding to the config.xmlversion's value
   */
    getVersionNumber(): Observable<string> {
        return Observable.create(observer => {
            if (this.helper.isMobile()) {
                this.appVersion.getVersionNumber().then((value: string) => {
                    observer.next(value);
                }).catch(err => {
                    console.log(err, 'To obtain app version fail');
                    observer.error(false);
                });
            } else {
                observer.next('1.0.7');
            }
        });
    }

	/**
	 * To obtain app name,
	 * @description  corresponding to the config.xmlname's value
	 */
    getAppName(): Observable<string> {
        return Observable.create(observer => {
            if (this.helper.isMobile()) {
                this.appVersion.getAppName().then((value: string) => {
                    observer.next(value);
                }).catch(err => {
                    console.log(err, 'To obtain app name fail');
                    observer.error(false);
                });
            } else {
                observer.next('Mobbi');
            }
        });
    }

	/**
	 * To obtain app's package name/id,examplecom.kit.ionic2tabs
	 * @description  corresponding to the config.xmlid's value
	 */
    getPackageName(): Observable<string> {
        return Observable.create(observer => {
            if (this.helper.isMobile()) {
                this.appVersion.getPackageName().then((value: string) => {
                    observer.next(value);
                }).catch(err => {
                    console.log(err, 'To obtain app package name fail');
                    observer.error(false);
                });
            } else {
                observer.next('com.mobbi.italy');
            }
        });
    }

    vibrate() {
        console.log("password error");
        this.vibration.vibrate(this.global.vibrationDuration);
    }


    getPictures(options = {}) {
        this.helper.assertIsMobile();
        const ops = {
            maximumImagesCount: 9,
            width: 1920,
            height: 1440,
            quality: 100,
            ...options
        };
        return Observable.create(observer => {
            ImagePicker.getPictures(result => {
                observer.next(result.images);
            }, err => {
                err === 'have cancelled' ? console.log(err) : LoggerService.error(err, 'NativeService.getPictures');
                observer.error(false);
            }, ops);
        });
    }


    savePicture(url: string) {
        this.helper.assertIsMobile();
        // return Observable.create(observer => {
        // 	this.photoLibrary.requestAuthorization({ read: true, write: true }).then(() => {
        // 		this.getAppVersionInfo().subscribe(appInfo => {
        // 			this.photoLibrary.saveImage(url, appInfo.name).then(res => {
        // 				observer.next(res);
        // 			}).catch(err => {
        // 				Logger.error(err, 'NativeService.savePicture');
        // 				observer.error(false);
        // 			});
        // 		});
        // 	}).catch(err => {
        // 		Logger.error(err, 'NativeService.savePicture');
        // 		observer.error(false);
        // 	});
        // });
    }

    share(message: string = null, file: string | string[] = null) {
        this.helper.assertIsMobile();
        // this.socialSharing.share(message, null, file);
    }
}
