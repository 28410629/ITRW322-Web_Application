import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {MessageTypeEnum} from '../enums/messagetype.enum';

export interface Conversations {
  conversations?: (Conversation)[] | null;
}

export interface Conversation {
  description: string;
  isgroupchat: boolean;
  id: string;
  name: string;
  participants: string[];
  groupPhotoURL: string;
  lastsentmessage: string;
  lastsentmessageuser: string;
  lastsentmessagedatetime: Timestamp;
  lastsentmessagetype: MessageTypeEnum;
}

export interface NewConversation {
  description: string;
  isgroupchat: boolean;
  name: string;
  participants: string[];
  groupPhotoURL: string;
}

export interface Messages {
  messages?: (Message)[] | null;
}


export interface Message {
  datetime: Timestamp;
  message: string;
  uid: string;
  type: MessageTypeEnum;
}
