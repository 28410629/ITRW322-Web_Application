import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {finalize} from 'rxjs/operators';
import {HeaderUserComponent} from '../application/header-user/header-user.component';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss']
})
export class ModalProfileComponent implements OnInit {

  imageChangedEvent: any;
  croppedImage;

  user: User;
  photoURL = 'assets/loadingProfile.png';
  angForm: FormGroup;

  users: Array<User>;
  currentDisplayName = '';

  // Photo upload
  ref;
  task;
  uploadProgress;
  downloadURL;

  constructor(
    public fireBaseService: FirebaseService,
    private afStorage: AngularFireStorage,
    private fb: FormBuilder,
    private header: HeaderUserComponent,
  ) {
    this.angForm = this.fb.group({
      DisplayName: ['', Validators.required],
      Email: ['', Validators.required],
      UID: ['', Validators.required]
    });
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getUsers();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getData();
    this.getAccountData();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.file;
    this.uploadPhoto();
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

  displayNameUniqueCheck(newDiysplayName) {
    for (const user of this.users) {
      if (user.displayName === newDiysplayName) {
        return false;
      }
    }
    return true;
  }

  submitChanges() {
    const newDiysplayName = this.angForm.controls['DisplayName'].value.trim();
    if (newDiysplayName === '') {
      window.alert('Please insert a Display Name.');
    } else if (newDiysplayName === this.currentDisplayName || this.displayNameUniqueCheck(newDiysplayName)) {
      this.fireBaseService.updateUserData(
        this.user.uid,
        newDiysplayName,
        this.photoURL);
      this.currentDisplayName = newDiysplayName;
    } else {
      window.alert('Display Name already exists. Please use a different one.');
    }
  }

  uploadPhoto() {

    this.ref = this.afStorage.ref('users/' + this.user.uid + '/photo');
    this.task = this.ref.put(this.croppedImage);

    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(downloadURL => {
          this.photoURL = downloadURL;
          this.submitChanges();
          this.uploadProgress = 0;
        });
      })
    ).subscribe();
  }

  getUsers() {
    this.fireBaseService.getUsers().subscribe(responseData => {
      this.users = responseData;
    });
  }

  getAccountData() {
    this.angForm.controls['Email'].setValue(this.user.email);
    this.angForm.controls['UID'].setValue(this.user.uid);
  }

  getData() {
    this.fireBaseService.getUserData(this.user.uid)
      .subscribe(
        responseData => {
          this.currentDisplayName = responseData.displayName;
          this.angForm.controls['DisplayName'].setValue(responseData.displayName);
          this.photoURL = responseData.photoURL;
        });
  }

  close() {
    this.header.closeModal();
  }

}
