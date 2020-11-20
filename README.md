# City Charge

This project is a cross-platform App developed based on the cordova Framework, which can be compiled to android, ios, Web and other platforms. cordova is a cross-platform development framework that provides native capabilities through plug-ins, and the UI and logic parts via Typescript.

# Environment Installation

The following is an example of a MAC computer to introduce the environment installation process of this project. If it is another system, please check the installation method of relevant software online

1. The node. Directly to/Node's official website (https://nodejs.org/en/download/), please download the installation package to corresponding.
When the installation is complete, it can be run in the terminal

```
node -v
v10.18.1
npm -v
6.13.4
```

To test if the installation is successful, Node must be v10!!

2. ionic, installation of cordova

```
npm install -g ionic@latest
npm intall -g cordova@latest

```

After successful installation,

```
ionic -v
cordova -v
npm i
npm i @cypherium/web3c
```

The version number should display correctly.

3. Installation of android Studio Please refer to [android Studio website] (HTTP: / / https://developer.android.com/studio/? & gclid = EAIaIQobChMI4Zegt8nj5QIVjamWCh38FQLjEAAYASAAEgL6Q_D_BwE) download and install, after opening, click on the Tools menu = > the SDK Manager, download and install the android SDK - 28.

4. Xcode installation: search Xcode directly in the app Store.
5. Modify IP address before debugging, SRC/environments/environment. Prod. Ts.
export const environment = {
production: true,
requestTimeout: 15000,
AppServerUrl: "", //APPServer API.
cypherium: {
Provider: 'http://127.0.0.1:18004',// change to blockchain server address and port number
pledgeContractAddr: '0x0000000000000000000000000000000000000081',
pledgeContractAbi: null,
privateKey: ''
}
};


# Project commissioning

Project debugging including Web, android, ios.

Web-based debugging

Running ionic Serve opens the link automatically in the browser and all changes are hot-updated to the browser without a manual refresh.

```
Build: ionic cordova build browser  
```
Because the > back-end interface is not currently configured across domains, front-end access is required to turn off chrome's security Settings. Exit Chrome completely, and then start using the ** -opena "Google Chrome" --args --disable-web-security --user-data-dir _** command line

Debugging based on android Studio

If you need to debug your plug-in, use native debugging. The commands to add and compile the project are as follows:

```
Add: ionic cordova platform add android@latest    
Delete: ionic cordova platform rm android   
Check: ionic cordova platform ls   
Build: ionic cordova build android --prod --release   
Run to real machine: ionic cordova run android   
```

You can open the project directory under the project directory, platforms/ android directory, with android Studio, and then conduct android debugging

Xcode-based debugging

If you need to debug your plug-in, use native debugging. The commands to add and compile the project are as follows:

```
Add: ionic cordova platform add ios@latest   
Delete: ionic cordova platform rm ios   
Check: ionic cordova platform ls  
Build: ionic cordova build ios --prod  
Run to real machine: ionic cordova run ios  
```

