import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'hotelBooking';
  userloggedIn = false;
  constructor(public authService: AuthService, private router: Router) {}
  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAYeCc8Lql_rOQT4nDSwPhoo5t_Xk3WdQU',
      authDomain: 'hotelbooking-e32f2.firebaseapp.com',
      databaseURL: 'https://hotelbooking-e32f2.firebaseio.com',
    });
  this.authService.isUserLoggedIn();

  }
  logout() {
      this.router.navigate(['/']);
      return firebase.auth().signOut();
  }
}

