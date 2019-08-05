
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface PublicChannels {
  Messages?: (PublicChannel)[] | null;
}

export interface PublicChannel {
  datetime: Timestamp;
  message: string;
  uid: string;
}
