import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { LoggerService } from '../logger/logger.service';
import { HelperService } from '../helper/helper.service';
import { GlobalService } from '../global/global.service';

export declare interface RequestSetting {
    useDefaultApi?: boolean;
    needCache?: boolean;
    showLoading?: boolean;
    ignoreError?: boolean;
}


@Injectable({
    providedIn: 'root'
})
export class HttpHelperService {
    static requestCount = 0; // Record the number of incomplete requests, close the loading when the number of requests is 0, and display the loading when the number is not 0

    constructor(public helper: HelperService) {
    }

    static getDefaultSetting(setting) {
        const defaultSetting: RequestSetting = {
            useDefaultApi: true,
            needCache: false,
            showLoading: false,
            ignoreError: false
        };
        return setting ? { ...defaultSetting, ...setting } : defaultSetting;
    }

    static getCacheData(options) {
        const cacheKey = HttpHelperService.getCacheKey(options);
        return StorageService.sessionStorage.get(cacheKey) || null;
    }

    static setCacheData(options, data: any) {
        const cacheKey = HttpHelperService.getCacheKey(options);
        StorageService.sessionStorage.set(cacheKey, data);
    }

    static getCacheKey(options) {
        const strParams = JSON.stringify(options.params);
        const strBody = JSON.stringify(options.body);
        return options.url + strParams + strBody;
    }

    requestBefore(options, setting: RequestSetting) {
        this.showLoading(setting);
        // if (this.helper.isMobile() && GlobalService.showLog) {
        if (this.helper.isMobile()) {
            console.log("Before request:" + JSON.stringify(options));
        } else {
            LoggerService.log('Before request:', '#3880ff', 'options:', options);
        }
    }

    requestSuccess(options) {
        this.hideLoading();
        // if (this.helper.isMobile() && GlobalService.showLog) {
        if (this.helper.isMobile()) {
            console.log("Request succeed for:" + options.url);
        } else {
            LoggerService.log('Request succeed:', '#10dc60', 'options:', options);
        }
    }

    requestError(options) {
        this.hideLoading();
        // if (this.helper.isMobile() && GlobalService.showLog) {
        if (this.helper.isMobile()) {
            console.log("Request error for:" + options.url);
        } else {
            LoggerService.log('Request failed:', '#f04141', 'options:', options);
        }
    }

    private showLoading(setting: RequestSetting) {
        ++HttpHelperService.requestCount;
        setting.showLoading && this.helper.showLoading();
    }

    private hideLoading() {
        --HttpHelperService.requestCount === 0 && this.helper.hideLoading();
    }

}
