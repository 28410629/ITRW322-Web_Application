
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface PublicChannels {
  Messages?: (PublicChannel)[] | null;
}

export interface PublicChannel {
  Message: string;
  UID: string;
  Date: Timestamp;

}
