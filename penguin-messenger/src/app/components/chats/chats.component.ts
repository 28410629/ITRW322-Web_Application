import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseListObservable} from '@angular/fire/database-deprecated';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirebaseService} from '../../services/firebase.service';
import {PublicChannel} from '../../models/publicChannel.model';
import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  angForm: FormGroup;
  items: Array<PublicChannel>;
  msgValue = '';

  constructor(private fb: FormBuilder, private afs: AngularFirestore, private fbService: FirebaseService) {
    this.createForm();
    this.getMessage();
  }


  createForm() {
    this.angForm = this.fb.group({
      message: ['', Validators.required ]
    });
  }
  ngOnInit() {
  }

  getMessage() {
  this.fbService.getPublicChannel().subscribe(responseData => {
    this.items = responseData; }
  );
  }

  sendMessage() {

    const user = JSON.parse(localStorage.getItem('user'));
    console.log(this.msgValue);
    this.fbService.createMessage(this.msgValue, user.uid);
    this.msgValue = '';
  }

  public getGoodDate(tstmp: Timestamp) {
    return tstmp.toDate();
  }


}
