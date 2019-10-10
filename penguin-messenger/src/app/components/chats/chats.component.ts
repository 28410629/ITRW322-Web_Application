import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { firestore } from 'firebase';
import Timestamp = firestore.Timestamp;
import { User} from '../../models/user.model';
import { Conversation, Message } from '../../models/message.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService} from '../../services/chat.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MessageTypeEnum } from '../../enums/messagetype.enum';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import { AudioRecordingService } from '../../services/AudioRecordingService';
import {DomSanitizer} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {MessagingService} from '../../messaging.service';
import {Subscription} from 'rxjs';

@Component({

  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})


export class ChatsComponent implements OnInit, OnDestroy {
  // All user data from firebase to add their display names and photos to the chats
  users: Array<User>;
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

  // subscription handling
  subscriptionChat: Subscription;
  subscriptionToDestroy: Subscription[] = [];

  // Error filetype popup
  IsError = false;

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
  inputlabeltext: string[];
  inputdir: string;

  // audio variables
  isRecording = false;
  recordedTime;
  blobUrl;
  blobFile;
  croppedImage;
  imageChangedEvent: any;
  compressedImgName;

  constructor(private firebaseService: FirebaseService,
              private afs: AngularFirestore,
              private chatService: ChatService,
              private modalService: BsModalService,
              private afStorage: AngularFireStorage,
              private formBuilder: FormBuilder,
              private audioRecordingService: AudioRecordingService,
              private sanitizer: DomSanitizer,
              private http: HttpClient,
              private msgService: MessagingService) {

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

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobFile = data.blob;
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
    });
  }

  // ------------------ Get data methods ------------------

  getUsers() {
    this.subscriptionToDestroy.push(this.firebaseService.getUsers().subscribe(responseData => {
      this.users = responseData;
    }));
  }

  getActiveConversations() {
    this.subscriptionToDestroy.push(this.chatService.getConversations(this.activeUser.uid).subscribe(responseData => {
      this.conversations  = responseData;
    }));
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
    const followDoc =
      this.afs.collection(`conversations`).doc(
        this.chatService.CreateIdForDirectConversation(this.activeUser.uid, selecteduseruid)
      ).ref;

    return followDoc.get().then((doc) => {
      if (doc.exists) {
        this.HideSelectNewConversation();
      } else {
        this.SelectNewConversation = false;
        this.chatService.CreateNewDirectConversation(this.activeUser.uid, selecteduseruid);
      }
    });
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

  // ------------------ Change to other active chat methods ------------------
  SetSelectedConversation(conversationid, conversationobject: Conversation) {
    if (this.subscriptionChat != null) {
      this.subscriptionChat.unsubscribe();
    }
    this.ChatIsSelected = true;
    this.Messages = null;
    this.ConversationPhoto = '';
    this.CurrentConversation = conversationobject;
    this.subscriptionChat = this.chatService.getConversationMessages(conversationid)
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

  openModal(template: TemplateRef<any>) {
    this.DeselectMedia();
    this.clearRecordedData();
    this.abortRecording();
    this.IsError = false;
    this.uploadProgress = 0;
    this.inputdir = '';
    this.modalRef = this.modalService.show(template, { backdrop: true , keyboard: true});
  }

  closeModal() {
    this.modalRef.hide();
    this.croppedImage = null;
    this.imageChangedEvent = null;
    this.abortRecording();
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

  setImageDetails(event) {
    const ImageFileName = event.target.files[0].name;

    if (this.validateImage(ImageFileName)) {
      this.IsError = false;
      this.compressedImgName = ImageFileName;
    } else {
      this.IsError = true;
    }

  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.file;
    this.uploadImageFile(this.messageType.image_message);
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show error message at later stage
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  sendAudio(event) {
    const AudioFileName = event.target.files[0].name;

    if (this.validateAudio(AudioFileName)) {
      this.IsError = false;
      this.uploadStorageFile(event, this.messageType.audio_message, AudioFileName.substring(AudioFileName.lastIndexOf('\\') + 1));
    } else {
      this.IsError = true;
    }
  }

  sendVideo(event) {
    const VideoFileName = event.target.files[0].name;

    if (this.validateVideo(VideoFileName)) {
      this.IsError = false;
      this.uploadStorageFile(event, this.messageType.video_message, VideoFileName.substring(VideoFileName.lastIndexOf('\\') + 1));
    } else {
      this.IsError = true;
    }
  }

  sendVoiceNote() {
    this.uploadVoiceFile(this.messageType.voicenote_message);
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  download(messageMedia: string) {
    window.open(messageMedia);
  }

  uploadStringLabel(dir: string) {
    this.inputlabeltext = dir.split('\\');
    return this.inputlabeltext[this.inputlabeltext.length - 1];
  }

  uploadStorageFile(event, messagetype, filename) {
    const messageid = this.afs.createId();

    this.ref = this.afStorage.ref('conversations/' + this.CurrentConversation.id + '/messages/' + messageid + '/' + filename);

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

  uploadImageFile(messagetype) {
    const messageid = this.afs.createId();

    this.ref = this.afStorage.ref('conversations/' + this.CurrentConversation.id + '/messages/' + messageid + '/' + this.compressedImgName);

    this.task = this.ref.put(this.croppedImage);

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


  uploadVoiceFile(messagetype) {
    const messageid = this.afs.createId();
    this.ref = this.afStorage.ref('conversations/' + this.CurrentConversation.id + '/messages/' + messageid + '/voice.mp3');
    const file = new File([this.blobFile], 'voice.mp3', { type: 'audio/mpeg' });
    this.task = this.ref.put(file);
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
      })).subscribe();
  }

  // Validation Methods
  validateImage(name: string) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'png' || ext.toLowerCase() === 'jpg' || ext.toLowerCase() === 'jpeg' || ext.toLowerCase() === 'gif'
      || ext.toLowerCase() === 'webp') {
      return true;
    } else {
      return false;
    }
  }

  validateVideo(name: string) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'mp4' || ext.toLowerCase() === 'm4a' || ext.toLowerCase() === 'mov' || ext.toLowerCase() === 'webm'
      || ext.toLowerCase() === 'avi' || ext.toLowerCase() === 'wmv') {
      return true;
    } else {
      return false;
    }
  }

  validateAudio(name: string) {
    const ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() === 'mp3' || ext.toLowerCase() === 'wav' || ext.toLowerCase() === 'aac' || ext.toLowerCase() === 'flac'
      || ext.toLowerCase() === 'wma') {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.msgService.getPermission();
    this.msgService.receiveMessage();
  }

  ngOnDestroy() {
    this.subscriptionToDestroy.forEach(x => {
      if (x != null) {
        x.unsubscribe();
      }
    });
    if (this.subscriptionChat != null) {
      this.subscriptionChat.unsubscribe();
    }
  }
}
