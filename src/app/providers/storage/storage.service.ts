import { Injectable } from '@angular/core';

/**
 * Cache tool class
 * Note: Be sure to use this method in your code to cache data so you can switch caching mechanisms later
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public static sessionStorage = {
        set(key: string, value: any) {
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        get(key: string) {
            const jsonString = sessionStorage.getItem(key);
            return jsonString ? JSON.parse(jsonString) : null;
        },
        remove(key: string) {
            sessionStorage.removeItem(key);
        },
        clear() {
            sessionStorage.clear();
        }
    };

    public static localStorage = {
        set(key: string, value: any) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get(key: string) {
            const jsonString = localStorage.getItem(key);
            return jsonString ? JSON.parse(jsonString) : null;
        },
        remove(key: string) {
            localStorage.removeItem(key);
        },
        clear() {
            localStorage.clear();
        }
    };

}
