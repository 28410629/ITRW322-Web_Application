
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export interface Posts {
  Posts?: (Post)[] | null;
}

export interface Post {
  Author: string;
  AuthorRouterUrl: string;
  ContentMdUrl: string;
  Date: Timestamp;
  Description: string;
  Featured: boolean;
  HomeImageUrl: string;
  Title: string;
  id: string;
}
