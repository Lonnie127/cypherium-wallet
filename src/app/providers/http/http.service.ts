import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, TimeoutError } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { UtilService } from '../util/util.service';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NativeService } from '../native/native.service';
import { HelperService } from '../helper/helper.service';
import { HttpHelperService, RequestSetting } from '../http-helper/http-helper.service';
import { GlobalService } from '../global/global.service';
import { TranslateService } from "@ngx-translate/core";


@Injectable({
    providedIn: 'root'
})
export class HttpService extends HttpHelperService {

    constructor(public http: HttpClient,
                public helper: HelperService,
                private translateService: TranslateService,
                public native: NativeService) {
        super(helper);
    }

    public get(url: string, params: any = {}, setting: RequestSetting = {}) {
        const options = {
            method: 'GET',
            url: url,
            params
        };
        return this.doRequest(options, setting);
    }

    public post(url: string, body: any = {}, setting: RequestSetting = {}): Observable<any> {
        const options = {
            method: 'POST',
            url: url,
            body,
            headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        };
        return this.doRequest(options, setting);
    }

    public delete(url: string, params: any = {}, setting: RequestSetting = {}) {
        const options = {
            method: 'DELETE',
            url: url,
            params
        };
        return this.doRequest(options, setting);
    }

    public postFormData(url: string, params: any = {}, setting: RequestSetting = {}): Observable<any> {
        const options = {
            method: 'POST',
            url: url,
            params,
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        };
        return this.doRequest(options, setting);
    }

    public doRequest(options, setting: RequestSetting) {
        const defaultSetting = HttpHelperService.getDefaultSetting(setting);
        return defaultSetting.useDefaultApi ? this.defaultRequest(options, defaultSetting) : this.request(options, defaultSetting);
    }

    /**
     * An app may have multiple back-end interface services (apis) that add business processing to the main API
     */
    public defaultRequest(options, setting: RequestSetting): Observable<any> {
        //  Use the default API:APP_SERVE_URL
        if (!options.url.startsWith('http')) {
            options.url = environment.appServerUrl + options.url;
        }
        console.log("defaultRequest:" + options.url);

        return Observable.create(observer => {
            this.request(options, setting).subscribe(res => {
                observer.next(res); // Data is the data returned by the main API convention
            }, err => {
                observer.error(err);
            });
        });
    }

    public request(ops, set: RequestSetting): Observable<any> {
        const options = {
            url: '',
            method: 'POST',
            body: null,
            params: null,
            urlWithParams: false,
            headers: null,
            reportProgress: false,
            withCredentials: false,
            responseType: 'json',
            header: {
                "Content-Type": "application/json",
                'Accept': 'application/json, text/plain',
                "cache-control": "no-cache",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Accept, Authorization, X-Request-With, Access-Control-Request-Method, Access-Control-Request-Headers",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT",
            },
            ...ops
        };
        const setting = HttpHelperService.getDefaultSetting(set);
        options.url = UtilService.formatUrl(options.url);
        console.log(JSON.stringify(set));
        console.log("The request url:" + options.url);
        return Observable.create(observer => {

            if (setting.needCache) {
                const cacheResult = HttpHelperService.getCacheData(options);
                if (cacheResult) {
                    observer.next(cacheResult);
                    return;
                }
            }
            this.requestBefore(options, setting);
            this.http.request(options.method, options.url, options).pipe(
                timeout(environment.requestTimeout)
            ).subscribe((res: any) => {
                setting.needCache && HttpHelperService.setCacheData(options, res); // If caching is required, save the data to sessionStorage
                let code = res.err_no; //An error will prompt you
                if (code && GlobalService.errorCode[code] && !set.ignoreError) {
                    this.helper.toast(GlobalService.errorCode[code]);
                }
                if (!this.helper.IsMobile) {
                    LoggerService.log('Response', '#10dc60', options.url, res);
                } else if (GlobalService.showLog) {
                    console.log("Request response:" + JSON.stringify(res) + " with url:" + options.url);
                }
                if (code && !set.ignoreError) {
                    this.requestError(options);
                    observer.error(this.requestFailedHandle(options.url, res.message));
                } else {
                    observer.next(res);
                    this.requestSuccess(options);
                }
            }, err => {
                if (!set.ignoreError) {
                    this.requestError(options);
                    observer.error(this.requestFailedHandle(options.url, err));
                }
            });
        });
    }

    async getTranslate(key) {
        let value: string = await new Promise((resolve, reject) => {
            this.translateService.get(key).subscribe((value) => {
                resolve(value)
            })
        })
        return value;
    }

    /**
     * Handle the failed request event
     */
    private async requestFailedHandle(url: string, err: HttpErrorResponse) { // : Response
        const status = err && err.status;
        let msg = await this.getTranslate('REQUEST_ERROR');
        // As agreed with the background, a status code of 400 is a business exception
        if (status === 400) {
            const errData = err.error;
            //  Invalid or expired 401 Token requires re-login
            if (errData.code === 401) {
                let error = await this.getTranslate('PAASSWORD_EXPIRED');
                this.helper.toast(error);
            } else {
                let tips = await this.getTranslate('TIPS');
                this.helper.alert(tips, GlobalService.errorCode[errData.code] || msg);
            }
            return errData;
        }
        if (this.helper.isMobile() && !this.native.isConnecting()) {
            let info = await this.getTranslate('NETWORK_ERROR');
            this.helper.alert(info);
        } else if (err instanceof TimeoutError) {
            let tips = await this.getTranslate('TIPS');
            let info = await this.getTranslate('NETWORK_TIMEOUT');
            this.helper.alert(tips, info);
        } else {
            if (status === 0) {
                msg = await this.getTranslate('BACKEND_ERROR');
            } else if (status === 404) {
                msg = await this.getTranslate('BACKEND_NOT_EXIST');
            } else if (status === 500) {
                msg = await this.getTranslate('BACKEND_ERROR1')
            }
            let tips = await this.getTranslate('REQUEST_FAILURE');
            this.helper.alert(tips, msg);
            LoggerService.http(err, {
                url,
                status
            });
        }
        return err;
    }

}
