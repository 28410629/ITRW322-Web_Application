import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import { User, UserData} from '../../models/user.model';
import { Conversation, Message, NewConversation } from '../../models/message.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


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

  // Show select new chat global variables
  SelectNewConversation: boolean;
  UsersNewConversation: Array<UserData>;

  // Selected conversation based firebase directory messages (global message model)
  Messages: Array<Message>;
  ConversationPhoto: string;
  ConversationName;
  ConversationPath;
  IsPublicChat = true;
  CurrentConversation: Conversation = {
    description: '',
    isgroupchat: false,
    id: '0',
    name: '',
    participants: null,
    groupPhotoURL: ''
  };

  constructor(private firebaseService: FirebaseService,
              private afs: AngularFirestore) {

    // Set the sidebar to active conversations
    this.SelectNewConversation = false;

    // Get active user data from local storage after login
    this.activeUser = JSON.parse(localStorage.getItem('user'));

    // Get user data for use within messages
    this.getUsers();

    // Set active user's open conversation in sidebar
    this.getActiveConversations();

    // Get public channel messages
    this.SetPublicConversation();

  }

  // ------------------ Get data methods ------------------

  getUsers() {
    this.firebaseService.getUsers().subscribe(responseData => {
      this.users = responseData;
    });
  }

  getActiveConversations() {
    this.firebaseService.getConversations(this.activeUser.uid).subscribe(responseData => {
      this.conversations = responseData;
    });
  }

  // ------------------ Start new chat methods ------------------
  ShowSelectNewConversation() {
    this.SelectNewConversation = true;
  }

  HideSelectNewConversation() {
    this.SelectNewConversation = false;
  }

  CreateNewDirectConversation(selecteduseruid: string) {
    if (this.CheckIfDirectConversationExists(selecteduseruid)) {
      const id = this.afs.createId();
      this.SelectNewConversation = false;
      const conversationRef: AngularFirestoreDocument<any> = this.afs.doc(`conversations/${id}`);
      const Participants: string[] = [this.activeUser.uid, selecteduseruid];
      const conversation: NewConversation = {
        description: '',
        isgroupchat: false,
        name: '',
        participants: Participants,
        groupPhotoURL: '',
      };
      conversationRef.set(conversation, {
        merge: true
      });
      this.HideSelectNewConversation();
    } else {
      this.HideSelectNewConversation();
    }
  }

  CheckIfDirectConversationExists(selecteduseruid): boolean {
    for (const conversation of this.conversations) {
      if (!conversation.isgroupchat) {
        for (const participant of conversation.participants) {
          if (participant === selecteduseruid) {
            // Conversation exists!
            return false;
          }
        }
      }
    }
    // Create conversation!
    return true;
  }

  CreateNewGroupConversation() {

  }

  // ------------------ Change to other active chat methods ------------------
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
    this.ConversationPhoto = '/assets/loadingProfile.png';
    this.IsPublicChat = true;
    this.ConversationPath = 'channels/public/messages';
    this.firebaseService.getPublicChannel().subscribe(responseData => {
      this.Messages = responseData;
      this.ConversationName = 'Public Channel';
      this.IsPublicChat = true;
    });
  }

  // ------------------ In chat methods for functionality ------------------
  sendMessage() {
    this.firebaseService.NewMessage(this.ConversationPath, this.msgValue, this.activeUser.uid);
    this.msgValue = '';
  }

  // ------------------ UI methods ------------------
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

  ngOnInit() {
  }
}
