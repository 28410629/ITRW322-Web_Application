import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import { User, UserData} from '../../models/user.model';
import { Conversation, Message } from '../../models/message.model';
import {getImportsOfUmdModule} from '@angular/compiler-cli/ngcc/src/host/umd_host';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  // All user data from firebase to add their display names and photos to the chats
  users: Array<UserData>;

  // Message being sent via input box
  msgValue = '';

  // Sidebar active conversation of active user
  conversations: Array<Conversation>;

  // Current active user
  activeUser: User;

  // Selected conversation based firebase directory messages (global message model)
  Messages: Array<Message>;
  ConversationPhoto: string;
  ConversationName;
  ConversationPath;
  IsPublicChat = true;
  CurrentConversation: Conversation;

  constructor(private firebaseService: FirebaseService) {
    // Get active user data from local storage after login
    this.activeUser = JSON.parse(localStorage.getItem('user'));

    // Get user data for use within messages
    this.getUsers();

    // Set active user's open conversation in sidebar
    this.getConversations();

    // Get public channel messages
    this.SetPublicConversation();
  }

  SetSelectedConversation(conversationid, conversationobject: Conversation) {
    this.ConversationPhoto = '';
    this.CurrentConversation = conversationobject;
    this.IsPublicChat = false;
    this.ConversationPath = 'conversations/' + conversationid + '/messages';
    this.firebaseService.getMessages(conversationid)
      .subscribe(responseData => {
        this.Messages = responseData;
        this.ConversationName = this.GetConversationName();

    });
  }

  GetConversationName(): string {
    if (this.CurrentConversation.isgroupchat) {
      this.ConversationPhoto = this.CurrentConversation.groupPhotoURL;
      return this.CurrentConversation.name;
    } else {
      if (this.CurrentConversation.participants[0] === this.activeUser.uid) {
        this.ConversationPhoto = this.getSenderImage(this.CurrentConversation.participants[1]);
        return this.getSenderName(this.CurrentConversation.participants[1]);
      } else {
        this.ConversationPhoto  = this.getSenderImage(this.CurrentConversation.participants[0]);
        return this.getSenderName(this.CurrentConversation.participants[0]);
      }
    }
  }

  SetPublicConversation() {
    this.IsPublicChat = true;
    this.ConversationPath = 'channels/public/messages';
    this.firebaseService.getPublicChannel().subscribe(responseData => {
      this.Messages = responseData;
      this.ConversationName = 'Public Channel';
      this.IsPublicChat = true;
    });
  }

  sendMessage() {
    this.firebaseService.NewMessage(this.ConversationPath, this.msgValue, this.activeUser.uid);
    this.msgValue = '';
  }

  public getGoodDate(tstmp: Timestamp) {
    return tstmp.toDate();
  }

  getSenderImage(uid) {
    for (const user of this.users) {
      if (user.uid === uid) {
        return user.photoURL;
      }
    }
  }

  getSenderName(uid) {
    for (const user of this.users) {
      if (user.uid === uid) {
        return user.displayName;
      }
    }
  }

  getChatType(isgroupchat: boolean) {
      if (isgroupchat) {
        return 'Group conversation.';
      } else {
        return 'Direct conversation.';
      }
  }

  getChatName(isgroupchat: boolean, name: string, participants: string[]) {
    if (isgroupchat) {
      return name;
    } else {
      if (participants[0] === this.activeUser.uid) {
        return this.getSenderName(participants[1]);
      } else {
        return this.getSenderName(participants[0]);
      }
    }
  }

  getChatPhoto(isgroupchat: boolean, groupImage, participants: string[]) {
    if (isgroupchat) {
      return groupImage;
    } else {
      if (participants[0] === this.activeUser.uid) {
        return this.getSenderImage(participants[1]);
      } else {
        return this.getSenderImage(participants[0]);
      }
    }
  }

  getChatPicture(isgroupchat: boolean) {
    if (isgroupchat) {
      return name;
    } else {
      return 'still need to detect other person';
    }
  }

  getUsers() {
    this.firebaseService.getUsers().subscribe(responseData => {
      this.users = responseData;
    });
  }

  getConversations() {
    this.firebaseService.getConversations(this.activeUser.uid).subscribe(responseData => {
      this.conversations = responseData;
    });
  }

  ngOnInit() {
  }
}
