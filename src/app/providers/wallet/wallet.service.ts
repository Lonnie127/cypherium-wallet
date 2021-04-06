import { Injectable } from '@angular/core';
import * as crypto from 'crypto';
import * as bip39 from 'bip39';
import {util, bech32} from 'cypheriumjs-crypto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class WalletService {
  hrp = environment.cypherium.theHrp;
  createRandom() {
    const mnemonic = this.generateRandomMnemonic();
    const seed = this.generateSeed(mnemonic);
    const keyPair = util.generateKeyPair(seed);
    const hexaddress = util.getAddressFromPubKey(keyPair.publicKey);
    const bech32address = this.toBech32Address(hexaddress);
    console.log('createRandom address', hexaddress)
    console.log('createRandom bech32addres', bech32address)
    return {
      address: hexaddress,
      bech32address: bech32address,
      mnemonic: mnemonic,
      path: "m/44'/60'/0'/0/0",
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    };
  }

  fromMnemonic(mnemonic) {
    const seed = this.generateSeed(mnemonic);
    const keyPair = util.generateKeyPair(seed);
    const hexaddress = util.getAddressFromPubKey(keyPair.privateKey);
    const bech32address = this.toBech32Address(hexaddress);
    console.log('fromMnemonic address', hexaddress)
    console.log('fromMnemonic bech32addres', bech32address)
    return {
      address: hexaddress,
      bech32address: bech32address,
      mnemonic: mnemonic,
      path: "m/44'/60'/0'/0/0",
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    };
  }

  fromPrivateKey(privateKey) {
    const keyPair = util.generateKeyPairFromPrivate(privateKey);
    const hexaddress = util.getAddressFromPrivKey(keyPair.privateKey);
    const bech32address = this.toBech32Address(hexaddress);
    console.log('fromPrivateKey address', hexaddress)
    console.log('fromPrivateKey bech32addres', bech32address)
    return {
      address: hexaddress,
      bech32address: bech32address,
      // mnemonic: mnemonic,
      path: "m/44'/60'/0'/0/0",
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    };
  }
  constructor() {

  }

  generateRandomMnemonic() {
    return bip39.generateMnemonic();
  }

  validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }
  fromBech32Address(address) {
    return bech32.fromBech32Address(this.hrp, address);
  }
  toBech32Address(address) {
    return bech32.toBech32Address(this.hrp, address);
  }
  generateSeed(mnemonic) {
    let hash = crypto.createHash('sha256');
    hash.update(mnemonic);
    return hash.digest('hex').toUpperCase();
  }



}
