import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  constructor() {}

  private publicKey = 'bPg8fmeBC4CNa5sptxY9BHBYMujMpbVU6UcjAj2ZDtGmhaE49y';

  public encryptConversationMessage(message: string, key: string) {
    return this.encryptText(message, key);
  }


  public decryptConversationMessage(message: string, key: string) {
    return this.decryptText(message, key);
  }

  public encryptChannelMessage(message: string) {
    return this.encryptText(message, this.publicKey);
  }


  public decryptChannelMessage(message: string) {
    return this.decryptText(message, this.publicKey);
  }

  private encryptText(plaintext: string, key: string) {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), key).toString();
  }

  private decryptText(cyphertext: string, key: string) {
    return CryptoJS.AES.decrypt(cyphertext, key).toString(CryptoJS.enc.Utf8);
  }
}


