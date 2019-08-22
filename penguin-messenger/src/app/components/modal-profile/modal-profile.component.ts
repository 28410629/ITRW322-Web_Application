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

  submitChanges() {
    this.fireBaseService.updateUserData(
      this.user.uid,
      this.angForm.controls['DisplayName'].value,
      this.photoURL);
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

  getAccountData() {
    this.angForm.controls['Email'].setValue(this.user.email);
    this.angForm.controls['UID'].setValue(this.user.uid);
  }

  getData() {
    this.fireBaseService.getUserData(this.user.uid)
      .subscribe(
        responseData => {
          this.angForm.controls['DisplayName'].setValue(responseData.displayName);
          this.photoURL = responseData.photoURL;
        });
  }

  close() {
    this.header.closeModal();
  }

}
