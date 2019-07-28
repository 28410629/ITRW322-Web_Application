import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit {

  displayName = 'Loading...';
  photoURL = '';

  constructor(public fireBaseService: FirebaseService) { }

  ngOnInit() {
    this.getData();
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
}
