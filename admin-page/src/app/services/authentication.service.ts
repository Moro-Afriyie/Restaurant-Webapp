import { getAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authState: any = null;
  constructor(public afAuth: AngularFireAuth) {
    console.log(this.afAuth.authState);
    this.afAuth.authState.subscribe((auth: any) => {
      this.authState = auth;
      console.log(auth.auth);
    });
  }

  /* Sign in */
  logIn(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async getAuthStatus() {
    let authUserstring = localStorage.getItem('authUser');
    if (authUserstring) {
      return JSON.parse(authUserstring);
    } else {
      let authUser = await this.afAuth.currentUser;
      if (authUser) {
        // localStorage.setItem('authUser', JSON.stringify(authUser));
        const status = {loggedIn: true}
        localStorage.setItem("authUser", JSON.stringify(status))
        return status;
      } else {
        return null;
      }
    }
  }

  /* Sign out */
  logOut() {
    localStorage.removeItem('authUser');
    return this.afAuth.signOut();
  }
}
