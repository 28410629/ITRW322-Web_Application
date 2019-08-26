import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MessageTypeEnum } from '../enums/messagetype.enum';
import { objectKeys } from 'codelyzer/util/objectKeys';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  uploadPercent: Observable<number>;

  constructor(private storage: AngularFireStorage) {}

  uploadUserProfilePhoto(file: File, uid) {
    const filePath = 'users/' + uid + '/photo';
    return this.uploadFile(file, filePath);
  }

  sendFile(file: File, conversationid: string, messageId: string, messageType: MessageTypeEnum) {
    const messageTypeString = objectKeys(MessageTypeEnum)[messageType + 6];
    const filePath = 'conversations/' + conversationid + '/messages/' + messageId + '/' +
      messageTypeString + '/' + messageTypeString.split('_', 1);
    return this.uploadFile(file, filePath);
  }

  uploadFile(file: File, filePath: string) {
    let downloadURL: Observable<string> = null;
    const fileLocal = file;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, fileLocal);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => downloadURL = fileRef.getDownloadURL() )
    )
      .subscribe();
    return downloadURL;
  }

  downloadFileURL(filePath: string) {
    const ref = this.storage.ref(filePath);
    return ref.getDownloadURL();
  }

  getUserProfilePhotoURL(uid) {
    const filePath = 'users/' + uid + '/photo';
    return this.downloadFileURL(filePath);
  }

  getConversationFileURL(conversationid: string, messageId: string, messageType: MessageTypeEnum) {
    const messageTypeString = objectKeys(MessageTypeEnum)[messageType + 6];
    const filePath = 'conversations/' + conversationid + '/messages/' + messageId + '/' +
      messageTypeString + '/' + messageTypeString.split('_', 1);
    return this.downloadFileURL(filePath);
  }
}


