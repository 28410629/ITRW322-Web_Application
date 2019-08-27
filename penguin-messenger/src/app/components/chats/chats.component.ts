import {Component, OnInit, TemplateRef} from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import { User, UserData} from '../../models/user.model';
import { Conversation, Message } from '../../models/message.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService} from '../../services/chat.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MessageTypeEnum } from '../../enums/messagetype.enum';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';

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
  messageType = {
    audio_message: MessageTypeEnum.audio_message,
    image_message: MessageTypeEnum.image_message,
    text_message: MessageTypeEnum.text_message,
    video_message: MessageTypeEnum.video_message,
    voicenote_message: MessageTypeEnum.voicenote_message
  };

  // Media upload selection variables
  IsAudioUpload = false;
  IsImageUpload = false;
  IsVideoUpload = false;
  IsVoiceNoteUpload = false;

  // Media upload variables
  ref;
  task;
  uploadProgress;

  // New line comp
  newLine = '***';

  // Sidebar active conversation of active user
  conversations: Array<Conversation>;

  // chat_selected
  ChatIsSelected = false;

  // Current active user
  activeUser: User;

  // Show select new chat global variables
  SelectNewConversation: boolean;
  ShowCreateGroupConversation = false;
  GroupCreationButton = 'Back To Start New Chat';
  GroupForm: FormGroup;
  IsCreateGroupIcon = false;

  // Show attachment popup menu
  showAttachmentMenu: boolean;
  modalRef: BsModalRef;

  // Selected conversation based firebase directory messages (global message model)
  Messages: Array<Message>;
  ConversationPhoto: string;
  ConversationName;
  CurrentConversation: Conversation = {
    description: '',
    isgroupchat: false,
    id: '0',
    name: '',
    participants: null,
    groupPhotoURL: '',
    lastsentmessage: '',
    lastsentmessageuser: '',
    lastsentmessagedatetime: null,
    lastsentmessagetype: null
  };

  constructor(private firebaseService: FirebaseService,
              private afs: AngularFirestore,
              private chatService: ChatService,
              private modalService: BsModalService,
              private afStorage: AngularFireStorage,
              private formBuilder: FormBuilder) {

    // Group form
    this.GroupForm = this.formBuilder.group({
      GroupName: ['', Validators.required],
      SelectedUsers: new FormArray([])
    });


    // Set the sidebar to active conversations
    this.SelectNewConversation = false;

    // Set popup menu to hide
    this.showAttachmentMenu = false;

    // Get active user data from local storage after login
    this.activeUser = JSON.parse(localStorage.getItem('user'));

    // Get user data for use within messages
    this.getUsers();

    // Set active user's open conversation in sidebar
    this.getActiveConversations();
  }

  // ------------------ Get data methods ------------------

  getUsers() {
    this.firebaseService.getUsers().subscribe(responseData => {
      this.users = responseData;
    });
  }

  getActiveConversations() {
    this.chatService.getConversations(this.activeUser.uid).subscribe(responseData => {
      this.conversations  = responseData;
    });
  }

  // ------------------ Start new chat methods ------------------
  ShowSelectNewConversation() {
    this.SelectNewConversation = true;
  }

  HideSelectNewConversation() {
    this.SelectNewConversation = false;
  }

  ShowCreateNewGroupConversation() {
    this.ShowCreateGroupConversation = true;
  }

  HideCreateNewGroupConversation() {
    this.ShowCreateGroupConversation = false;
  }

  CreateNewDirectConversation(selecteduseruid: string) {
    if (this.CheckIfDirectConversationExists(selecteduseruid)) {
      this.SelectNewConversation = false;
      this.chatService.CreateNewDirectConversation(this.activeUser.uid, selecteduseruid);
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
    const formArray: FormArray = this.GroupForm.get('SelectedUsers') as FormArray;
    // Checks if group has at least 1 participant
    if (formArray.length !== 0) {
      // Checks that the group name is not ''
      if (this.GroupForm.get('GroupName').value.toString().trim() !== '') {
        // Adds active user to array of participants
        formArray.push(new FormControl(this.activeUser.uid));
        this.SelectNewConversation = false;
        this.chatService.CreateNewGroupConversation(this.GroupForm.get('GroupName').value, this.GroupForm.get('SelectedUsers').value);
        this.HideCreateNewGroupConversation();
      }
    } else {
      this.HideCreateNewGroupConversation();
    }
  }

  // This method is used to add users dynamically to an array for use with group chat creation

  onCheckChange(event, useruid) {
    const formArray: FormArray = this.GroupForm.get('SelectedUsers') as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(useruid));
    } else {
      /* unselected */

      // find the unselected element
      let i = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === useruid) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    if (formArray.length === 0) {
      this.GroupCreationButton = 'Back To Start New Chat';
      this.IsCreateGroupIcon = false;
    } else {
      this.GroupCreationButton = 'Create Group Chat';
      this.IsCreateGroupIcon = true;
    }
  }

  // ------------------ Set attachments to active ----------------------------

  SetAttachmentsMenu() {
      this.showAttachmentMenu = true;
  }

  setAttachmentsFale() {
    this.showAttachmentMenu = false;
  }

  // ------------------ Change to other active chat methods ------------------
  SetSelectedConversation(conversationid, conversationobject: Conversation) {
    this.ChatIsSelected = true;
    this.Messages = null;
    this.ConversationPhoto = '';
    this.CurrentConversation = conversationobject;
    this.chatService.getConversationMessages(conversationid)
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

  // ------------------ In chat methods for functionality ------------------
  sendMessage() {
    if (this.msgValue.trim() !== '') {
      this.chatService.sendConversationMessage(this.CurrentConversation.id, this.msgValue, this.activeUser.uid);
      this.msgValue = '';
    }
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true , keyboard: true});
  }

  closeModal() {
    this.modalRef.hide();
  }

  // ------------------ Media functionality ------------------
  SelectMediaImage() {
    this.IsImageUpload = true;
  }

  SelectMediaAudio() {
    this.IsAudioUpload = true;
  }

  SelectMediaVideo() {
    this.IsVideoUpload = true;
  }

  SelectMediaVoiceNote() {
    this.IsVoiceNoteUpload = true;
  }

  DeselectMedia() {
    this.IsAudioUpload = false;
    this.IsImageUpload = false;
    this.IsVideoUpload = false;
    this.IsVoiceNoteUpload = false;
  }

  sendImage(event) {
    this.uploadStorageFile(event, this.messageType.image_message);
  }

  sendAudio(event) {
    this.uploadStorageFile(event, this.messageType.audio_message);
  }

  sendVideo(event) {
    this.uploadStorageFile(event, this.messageType.video_message);
  }

  sendVoiceNote(event) {
    this.uploadStorageFile(event, this.messageType.voicenote_message);
  }

  uploadStorageFile(event, messagetype) {
    const messageid = this.afs.createId();

    this.ref = this.afStorage.ref('conversations/' + this.CurrentConversation.id + '/messages/' + messageid + '/file');

    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL()
          .subscribe(FileDownloadURL => {
          // Send media message
          if (messagetype === MessageTypeEnum.voicenote_message) {
            this.chatService.sendVoiceNoteMessage(this.CurrentConversation.id, FileDownloadURL, this.activeUser.uid, messageid);
          } else if (messagetype === MessageTypeEnum.image_message) {
            this.chatService.sendImageMessage(this.CurrentConversation.id, FileDownloadURL, this.activeUser.uid, messageid);
          } else if (messagetype === MessageTypeEnum.video_message) {
            this.chatService.sendVideoMessage(this.CurrentConversation.id, FileDownloadURL, this.activeUser.uid, messageid);
          } else if (messagetype === MessageTypeEnum.audio_message) {
            this.chatService.sendAudioMessage(this.CurrentConversation.id, FileDownloadURL, this.activeUser.uid, messageid);
          } else {
             console.log('Error sending media message.');
          }
          // Reset progressbar
          this.uploadProgress = 0;
          // Close modal
          this.closeModal();
          // Deselect media upload
          this.DeselectMedia();
        });
      })
    ).subscribe();
  }

  ngOnInit() {
  }
}
