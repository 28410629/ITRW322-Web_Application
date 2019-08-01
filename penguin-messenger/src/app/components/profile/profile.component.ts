import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../models/user.model';
import { FirebaseService } from '../../services/firebase.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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
    private fb: FormBuilder
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

  submitChanges() {
    this.fireBaseService.updateUserData(
      this.user.uid,
      this.angForm.controls['DisplayName'].value,
      this.photoURL);
    console.log(JSON.parse(localStorage.getItem('usersData')));
  }

  uploadPhoto(event) {
    this.ref = this.afStorage.ref('users/' + this.user.uid + '/photo');
    this.task = this.ref.put(event.target.files[0]);
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
}
