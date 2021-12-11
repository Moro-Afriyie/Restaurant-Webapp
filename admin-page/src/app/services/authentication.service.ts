import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  /* Sign in */
  logIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /* Sign out */
  logOut() {
    return this.afAuth.signOut();
  }
}
