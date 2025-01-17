import { Injectable } from '@angular/core';
import * as crypto from 'crypto';
import * as nacl from 'tweetnacl';
import * as bip39 from 'bip39';
import * as RIPEMD160 from 'ripemd160';
import * as jsSHA from 'jssha';
import * as ed25519 from '@stablelib/ed25519';

const PUBKEY_LENGTH = 64; // 32 bytes
const SEED_LENGTH = 64; // 32 bytes
const PRIVKEY_LENGTH = 128; // 64 bytes
const ADDRESS_LENGTH = 40; //20 bytes

const PUBKEY_NAME = 'PublicKey';
const SEED_NAME = 'Seed';
const PRIVKEY_NAME = 'PrivateKey';
const ADDRESS_NAME = 'Address';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  createRandom() {
    let mnemonic = this.generateRandomMnemonic();
    let seed = this.generateSeed(mnemonic);
    let keyPair = this.generateKeyPair(seed);
    let address = this.getHexAddressFromPubKey(keyPair.publicKey);

    return{
      address: address,
      mnemonic: mnemonic,
      path: "m/44'/60'/0'/0/0",
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    };
  }

  fromMnemonic(mnemonic) {
    let seed = this.generateSeed(mnemonic);
    let keyPair = this.generateKeyPair(seed);
    let address = this.getHexAddressFromPubKey(keyPair.publicKey);

    return {
      address: address,
      mnemonic: mnemonic,
      path: "m/44'/60'/0'/0/0",
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    };
  }

  fromPrivateKey(privateKey) {
    let keyPair = this.generateKeyPairFromPrivate(privateKey);
    let address = this.getHexAddressFromPubKey(keyPair.publicKey);

    return {
      address: address,
      path: "m/44'/60'/0'/0/0",
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    };
  }
  constructor() { }

  generateKeyPair(seed) {
    this._isHexString(seed, SEED_NAME, SEED_LENGTH);
    let buffString = seed;
    let buffer = new Buffer(buffString, "hex")
    let keyPair = nacl.sign.keyPair.fromSeed(buffer);
    return {
      publicKey: this._bytesToHexString(keyPair.publicKey).toUpperCase(),
      privateKey: this._bytesToHexString(keyPair.secretKey).toUpperCase(),
    };
  }

  generateKeyPairFromPrivate(prv) {
    this._isHexString(prv, PRIVKEY_NAME, PRIVKEY_LENGTH);
    return {
      publicKey: prv.substring(64, 128).toUpperCase(),
      privateKey: prv.toUpperCase(),
    };
  }

  generateRandomMnemonic() {
    return bip39.generateMnemonic();
  }

  generateSeed(mnemonic) {
    let hash = crypto.createHash('sha256');
    hash.update(mnemonic);
    return hash.digest('hex').toUpperCase();
  }

  getHexAddressFromPubKey(publicKey) {
    this._isHexString(publicKey, PUBKEY_NAME, PUBKEY_LENGTH);
    let shaObj = new jsSHA("SHA3-256", "HEX");
    shaObj.update(publicKey);
    let hash = shaObj.getHash("HEX");
    let ripemd160 = new RIPEMD160();
    let encodedPubKey = this._hexStringToBytes(hash);
    var buffer = new Buffer(encodedPubKey);
    return ripemd160.update(buffer).digest('hex').toUpperCase();
  }


  getAddressFromPrivKey(privateKey) {
    this._isHexString(privateKey, PRIVKEY_NAME, PRIVKEY_LENGTH);
    let publicKey = privateKey.substring(64, 128);
    return this.getHexAddressFromPubKey(publicKey);

  }

  getPubKeyFromPrivKey(privateKey) {
    this._isHexString(privateKey, PRIVKEY_NAME, PRIVKEY_LENGTH);
    return privateKey.substring(64, 128);
  }

  validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }

  validatePrivate(privateKey) {
    this._isHexString(privateKey, PRIVKEY_NAME, PRIVKEY_LENGTH);
    let p = new Uint8Array(this._hexStringToBytes(privateKey));
    let k = new Uint8Array(this._hexStringToBytes(privateKey.substring(64, 128)));
    let pubKey = privateKey.substring(64, 128);
    let sig25519 = ed25519.sign(p, new Uint8Array([1, 2, 3]));
    let ok = ed25519.verify(k, new Uint8Array([1, 2, 3]), sig25519);
    return ok === true;
  }

  validateAddress(publicKey, address) {
    this._isHexString(publicKey, PUBKEY_NAME, PUBKEY_LENGTH);
    this._isHexString(address, ADDRESS_NAME, ADDRESS_LENGTH);

    if (this.getHexAddressFromPubKey(publicKey).toUpperCase() == address.toUpperCase())
      return true;

    return false;
  }

  sign(privKeyStr, txStr) {
    let buffer = new Buffer(txStr);
    let privKey = new Buffer(privKeyStr, "hex");
    let signature = nacl.sign.detached(buffer, privKey);
    return this._bytesToHexString(signature).toUpperCase();
  }

  verify(privKeyStr, encTxStr, sigStr) {
    let sig = new Buffer(sigStr);
    let buffer = new Buffer(encTxStr);
    let privKey = new Buffer(privKeyStr, "hex");
    let verify = nacl.sign.detached.verify(buffer, sig, privKey);
    return this._bytesToHexString(verify).toUpperCase();
  }

  _isHexString(hexString, name, length) {
    if (typeof hexString != 'string') {
      throw new Error('\nError : The type of ' + name + ' must be string!');
    }
    if (hexString.length != length) {
      throw new Error('\nError : The length of ' + name + ' must be ' + length);
    }
    let arr = hexString.split('');
    for (let i = 0; i < arr.length; i++)
      if (!arr[i].match(/[0-9A-Fa-f]/))
        throw new Error("Error : unexpected junk in  " + name);
  }

  _hexStringToBytes(hexStr) {
    let result = [];
    while (hexStr.length >= 2) {
      result.push(parseInt(hexStr.substring(0, 2), 16));
      hexStr = hexStr.substring(2, hexStr.length);
    }
    return result;
  }

  _bytesToHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function (byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
  }
}
