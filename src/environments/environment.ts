// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    requestTimeout: 30000,
    appServerUrl: "https://cyphercomb.xyz", //APPServer API
    cypherium: {
        provider: 'http://137.117.70.161:8000',
        pledgeContractAddr: '0x0000000000000000000000000000000000000081',
        pledgeContractAbi: null,
        privateKey: ''
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
