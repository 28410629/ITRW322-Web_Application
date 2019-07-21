import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService) { }

  tryLogout() {
    this.authService.SignOut();
    const audio = new Audio();
    audio.src = 'assets/LogoutSound.mp3';
    audio.load();
    audio.play();
  }

  ngOnInit() {
  }

}
