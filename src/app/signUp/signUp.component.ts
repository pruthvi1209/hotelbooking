import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authService';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(  private authService: AuthService, private router: Router) { }

  ngOnInit() {
     this.authService.isUserLoggedIn().then((value) => {
       if (value) {
       this.router.navigate(['/']);
       }
     });
  }

  onSignUp( form: NgForm) {
    const email = form.value.email;
    const password = form.value. password;
    this.authService.signup( email, password);
  }
  socailLogin() {
    this.authService.social();
  }
}
