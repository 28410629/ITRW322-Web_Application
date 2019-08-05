import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private afStorage: AngularFireStorage) {}

    uploadUserPhoto(UID, event) {
    this.afStorage.upload('/users/' + UID + '/photo', event.target.files[0]);
  }
}


