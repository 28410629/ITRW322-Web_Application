import {Component, OnInit, TemplateRef} from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import {AuthService} from '../../../services/authorisation/auth.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit {

  displayName = '';
  photoURL = 'assets/loadingProfile.png';
  // Show attachment popup menu
  showAttachmentMenu: boolean;
  modalRef: BsModalRef;

  constructor(public fireBaseService: FirebaseService,
              public authService: AuthService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getData();
  }

  tryLogout() {
    this.authService.SignOut();
    const audio = new Audio();
    audio.src = 'assets/LogoutSound.mp3';
    audio.load();
    audio.play();
  }

  getData() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.fireBaseService.getUserData(user.uid)
      .subscribe(
        responseData => {
          this.displayName = responseData.displayName;
          this.photoURL = responseData.photoURL;
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { backdrop: true , keyboard: true});
  }
}
