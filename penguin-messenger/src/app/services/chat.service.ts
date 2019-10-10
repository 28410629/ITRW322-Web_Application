import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Conversation, Message, Messages, NewConversation} from '../models/message.model';
import { CryptoService } from './crypto.service';
import { MessageTypeEnum } from '../enums/messagetype.enum';
import { firestore } from 'firebase';
import Timestamp = firestore.Timestamp;


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
      .where('participants', 'array-contains', userid)
      .orderBy('lastsentmessagedatetime', 'desc'))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Conversation;
            const id = a.payload.doc.id;

            if (data.lastsentmessagetype === MessageTypeEnum.text_message) {
              data.lastsentmessage = this.cryptoService.decryptConversationMessage(data.lastsentmessage, id);
            } else if (data.lastsentmessagetype === MessageTypeEnum.voicenote_message) {
              data.lastsentmessage = 'Voice Note Message';
            } else if (data.lastsentmessagetype === MessageTypeEnum.image_message) {
              data.lastsentmessage = 'Image Message';
            } else if (data.lastsentmessagetype === MessageTypeEnum.video_message) {
              data.lastsentmessage = 'Video Message';
            } else if (data.lastsentmessagetype === MessageTypeEnum.audio_message) {
              data.lastsentmessage = 'Audio Message';
            } else if (data.lastsentmessagetype === MessageTypeEnum.new_message) {
              data.lastsentmessage = 'New Conversation';
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

  public sendImageMessage(conversationid: string, newmessage: string, newuid: string, messageid: string) {
    this.sendConversationMediaMessage(conversationid, newmessage, newuid, messageid, MessageTypeEnum.image_message);
  }

  public sendAudioMessage(conversationid: string, newmessage: string, newuid: string, messageid: string) {
    this.sendConversationMediaMessage(conversationid, newmessage, newuid, messageid, MessageTypeEnum.audio_message);
  }

  public sendVideoMessage(conversationid: string, newmessage: string, newuid: string, messageid: string) {
    this.sendConversationMediaMessage(conversationid, newmessage, newuid, messageid, MessageTypeEnum.video_message);
  }

  public sendVoiceNoteMessage(conversationid: string, newmessage: string, newuid: string, messageid: string) {
    this.sendConversationMediaMessage(conversationid, newmessage, newuid, messageid, MessageTypeEnum.voicenote_message);
  }

  private sendConversationMediaMessage(conversationid: string, newmessage: string, newuid: string, messageid: string, messagetype) {
    const messageRef: AngularFirestoreDocument<any> = this.db.doc(`conversations/${conversationid}/messages/${messageid}`);
    const updatepath = 'conversations/' + conversationid;
    const cypherText = this.cryptoService.encryptConversationMessage(newmessage, conversationid);
    const adddatetime = Timestamp.now();
    const message: Message = {
      datetime: adddatetime,
      message: cypherText,
      uid: newuid,
      type: messagetype
    };
    messageRef.set(message, {
      merge: true
    });
    this.db.doc(updatepath).update({
      lastsentmessage: cypherText,
      lastsentmessageuser: newuid,
      lastsentmessagedatetime: adddatetime,
      lastsentmessagetype: messagetype
    });
  }

  public CreateIdForDirectConversation(activeuserid: string, selecteduserid: string): string {
    for (let i = 0; i < activeuserid.length; i++) {
      if (activeuserid.charAt(i) !== selecteduserid.charAt(i)) {
        if (activeuserid.charAt(i) > selecteduserid.charAt(i)) {
          return activeuserid.concat(selecteduserid);
        } else {
          return selecteduserid.concat(activeuserid);
        }
      }
    }
    return null;
  }

  public CreateNewDirectConversation(activeuserid, selecteduserid) {
    const id = this.CreateIdForDirectConversation(activeuserid, selecteduserid);
    const conversationRef: AngularFirestoreDocument<any> = this.db.doc(`conversations/${id}`);
    const Participants: string[] = [activeuserid, selecteduserid];
    const conversation: NewConversation = {
      description: '',
      isgroupchat: false,
      name: '',
      participants: Participants,
      groupPhotoURL: '',
      lastsentmessage: '',
      lastsentmessageuser: '',
      lastsentmessagedatetime: Timestamp.now(),
      lastsentmessagetype: MessageTypeEnum.new_message
    };
    conversationRef.set(conversation, {
      merge: true
    });
    return id;
  }
  // this.GroupForm.get('GroupName').value, this.GroupForm.get('SelectedUsers').value
  public CreateNewGroupConversation(Name, Participants) {
    const id = this.db.createId();
    const conversationRef: AngularFirestoreDocument<any> = this.db.doc(`conversations/${id}`);
    const conversation: NewConversation = {
      description: '',
      isgroupchat: true,
      name: Name,
      participants: Participants,
      groupPhotoURL: 'https://firebasestorage.googleapis.com/v0/b/itrw322-semester-project.appspot.com/o/defaults%2FdefaultUserPhoto.png?alt=media&token=5222876d-ea95-4cb9-a8a4-71d898c595d4',
      lastsentmessage: '',
      lastsentmessageuser: '5',
      lastsentmessagedatetime: Timestamp.now(),
      lastsentmessagetype: MessageTypeEnum.new_message
    };
    conversationRef.set(conversation, {
      merge: true
    });
  }
}


