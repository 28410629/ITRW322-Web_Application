import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirebaseService} from '../../services/firebase.service';
import {PublicChannel} from '../../models/publicChannel.model';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {User, UserData} from '../../models/user.model';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  angForm: FormGroup;
  messages: Array<PublicChannel>;
  msgValue = '';
  users: Array<UserData>;
  activeUser: User;

  constructor(private fb: FormBuilder, private afs: AngularFirestore, private fbService: FirebaseService) {
    this.activeUser = JSON.parse(localStorage.getItem('user'));
    this.createForm();
    this.getMessages();
    this.getUsers();
  }

  createForm() {
    this.angForm = this.fb.group({
      message: ['', Validators.required ]
    });
  }
  ngOnInit() {
  }

  getMessages() {
  this.fbService.getPublicChannel().subscribe(responseData => {
    this.messages = responseData; }
  );
  }

  sendMessage() {
    console.log(this.msgValue);
    this.fbService.createMessage(this.msgValue, this.activeUser.uid);
    this.msgValue = '';
  }

  public getGoodDate(tstmp: Timestamp) {
    return tstmp.toDate();
  }

  getSenderImage(uid) {
    for (const user of this.users) {
      if (user.id === uid) {
        return user.photoURL;
      }
    }
  }

  getUsers() {
    this.fbService.getUsers().subscribe(responseData => {
      this.users = responseData;
      console.log(responseData);
    });
  }
}
