import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './providers/auto-guard/auth-guard.service';

const routes: Routes = [
    // {
    //     path: '',
    //     redirectTo: '/wallet-create',
    //     pathMatch: 'full'
    // },
    { path: '', redirectTo: 'wallet', pathMatch: 'full' },
    // { path: '', canActivate: [AuthGuardService], loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
    { path: 'wallet', canActivate: [AuthGuardService], loadChildren: './pages/tabs/wallet/wallet.module#WalletPageModule' },
    { path: 'pledge', canActivate: [AuthGuardService], loadChildren: './pages/tabs/pledge/pledge.module#PledgePageModule' },
    { path: 'setting', canActivate: [AuthGuardService], loadChildren: './pages/tabs/setting/setting.module#SettingPageModule' },
    { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
    { path: 'change-password', loadChildren: './pages/change-password/change-password.module#ChangePasswordPageModule' },
    { path: 'backup-mnemonic', loadChildren: './pages/backup-mnemonic/backup-mnemonic.module#BackupMnemonicPageModule' },
    { path: 'export-mnemonic', loadChildren: './pages/export-mnemonic/export-mnemonic.module#ExportMnemonicPageModule' },
    { path: 'export-keystore', loadChildren: './pages/export-keystore/export-keystore.module#ExportKeystorePageModule' },
    { path: 'wallet-admin', loadChildren: './pages/wallet-admin/wallet-admin.module#WalletAdminPageModule' },
    { path: 'language-toggle', loadChildren: './pages/language-toggle/language-toggle.module#LanguageTogglePageModule' },
    { path: 'value-unit', loadChildren: './pages/value-unit/value-unit.module#ValueUnitPageModule' },
    { path: 'wallet-create', loadChildren: './pages/wallet-create/wallet-create.module#WalletCreatePageModule' },
    { path: 'transaction-result', loadChildren: './pages/transaction-result/transaction-result.module#TransactionResultPageModule' },
    { path: 'cph-receive', loadChildren: './pages/cph-receive/cph-receive.module#CphReceivePageModule' },
    { path: 'cph-send', loadChildren: './pages/cph-send/cph-send.module#CphSendPageModule' },
    { path: 'wallet-detail', loadChildren: './pages/wallet-detail/wallet-detail.module#WalletDetailPageModule' },
    { path: 'wallet-import', loadChildren: './pages/wallet-import/wallet-import.module#WalletImportPageModule' },
    { path: 'wallet-name', loadChildren: './pages/wallet-name/wallet-name.module#WalletNamePageModule' },
    { path: 'export-privatekey', loadChildren: './pages/export-privatekey/export-privatekey.module#ExportPrivatekeyPageModule' },
    { path: 'scan', loadChildren: './pages/scan/scan.module#ScanPageModule' },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
