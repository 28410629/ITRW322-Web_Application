import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Conversation, Message, Messages } from '../models/message.model';
import { CryptoService } from './crypto.service';
import { MessageTypeEnum } from '../enums/messagetype.enum';


@Injectable({
  providedIn: 'root'
})

export class ChatService {

  constructor(private db: AngularFirestore, private cryptoService: CryptoService) {}

  public getChannelMessages(): Observable<Message[]> {
    return this.db.collection<Messages>('channels/public/messages', ref => ref.orderBy('datetime', 'asc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Message;
            data.message = this.cryptoService.decryptChannelMessage(data.message);
            return { ...data };
          });
        })
      );
  }

  public getConversationMessages(conversationid): Observable<Message[]> {
    return this.db.collection<Messages>('conversations/' + conversationid + '/messages', ref => ref.orderBy('datetime', 'asc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Message;
            data.message = this.cryptoService.decryptConversationMessage(data.message, conversationid);
            return { ...data };
          });
        })
      );

  }

  public getConversations(userid): Observable<Conversation[]> {
    return this.db.collection('conversations', ref => ref
      .where('participants', 'array-contains', userid))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Conversation;
            const id = a.payload.doc.id;
            if (data.lastsentmessagetype === MessageTypeEnum.text_message) {
              data.lastsentmessage = this.cryptoService.decryptConversationMessage(data.lastsentmessage, id);
              //data.lastsentmessage = 'Message';
            } else if (data.lastsentmessagetype === MessageTypeEnum.voicenote_message) {
              data.lastsentmessage = 'Voice Note';
            } else if (data.lastsentmessagetype === MessageTypeEnum.image_message) {
              data.lastsentmessage = 'Image';
            } else if (data.lastsentmessagetype === MessageTypeEnum.video_message) {
              data.lastsentmessage = 'Video';
            } else if (data.lastsentmessagetype === MessageTypeEnum.audio_message) {
              data.lastsentmessage = 'Audio';
            } else {
              data.lastsentmessage = 'Error Retrieving Message';
            }
            return { id, ...data };
          });
        })
      );
  }

  public sendConversationMessage(conversationid: string, newmessage: string, newuid: string) {
    const path = 'conversations/' + conversationid + '/messages';
    const updatepath = 'conversations/' + conversationid;
    const cypherText = this.cryptoService.encryptConversationMessage(newmessage, conversationid);
    const adddatetime = new Date();
    this.db.collection(path).add({
      datetime: adddatetime,
      message: cypherText,
      uid: newuid,
      type: MessageTypeEnum.text_message
    });
    this.db.doc(updatepath).update({
      lastsentmessage: cypherText,
      lastsentmessageuser: newuid,
      lastsentmessagedatetime: adddatetime,
      lastsentmessagetype: MessageTypeEnum.text_message
    });
  }
}


