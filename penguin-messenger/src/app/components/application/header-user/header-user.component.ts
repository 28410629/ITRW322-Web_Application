import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { AuthService} from '../../../services/authorisation/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { User } from '../../../models/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit, OnDestroy {

  displayName = 'Loading...';
  photoURL = 'assets/loadingProfile.png';
  // Show attachment popup menu
  showAttachmentMenu: boolean;
  modalRef: BsModalRef;
  user: User;
  subToDestroy: Subscription;

  constructor(public fireBaseService: FirebaseService,
              public authService: AuthService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getInitialData();
    this.getUserData();
  }

  tryLogout() {
    this.authService.SignOut();
    const audio = new Audio();
    audio.src = 'assets/logout.mp4';
    audio.load();
    audio.play();
  }

  getInitialData() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.displayName = this.user.displayName;
    this.photoURL = this.user.displayName;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true , keyboard: true});
  }

  getUserData() {
    this.subToDestroy = this.fireBaseService.getUserData(this.user.uid)
      .subscribe(
        responseData => {
          this.displayName = responseData.displayName;
          this.photoURL = responseData.photoURL;
        });
  }

  closeModal() {
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    if (this.subToDestroy != null) {
      this.subToDestroy.unsubscribe();
    }
  }

}
