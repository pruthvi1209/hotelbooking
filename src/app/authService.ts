
import * as firebase from 'firebase';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

    token: string;
constructor(private router: Router) {}
signup(email: string , password: string) {
firebase.auth().createUserWithEmailAndPassword( email , password ).then( () => {
console.log('user created');
},
(e) => {
    if (e.code === 'auth/email-already-in-use') {
        this.signIn(email, password);
    } else {
        console.log(e);
    }
});
}
signIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then((value) => {
        this.router.navigate(['/bookRoom']);
    },
    (e) => {
        console.log(e);
    });
}
social() {
    let userDetails;
    userDetails = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(userDetails).then((result) => {
        console.log(result);
        this.router.navigate(['/bookRoom']);
    }).catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
    });
}
isUserLoggedIn() {
    const promise = new Promise ( (resolve) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user.getIdToken().then(
                    (token: string) => {
                        this.token = token;
                        resolve(true);
                    });
            } else {
                this.token = null;
                resolve(false);
            }
        });
        });
        return promise ;
}
isUserAuthenticated() {
    return this.token != null;
}
}
