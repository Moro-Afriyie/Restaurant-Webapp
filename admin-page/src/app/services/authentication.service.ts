import { getAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(public afAuth: AngularFireAuth) {}

  /* Sign in */
  logIn(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  getAuthStatus(): any {
    return this.afAuth.currentUser;
  }

  /* Sign out */
  logOut() {
    return this.afAuth.signOut();
  }
}
