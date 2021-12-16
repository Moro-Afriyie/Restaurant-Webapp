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
    return new Promise((resolve, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((res) => resolve(res))
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getAuthStatus() {
    let authUserstring = localStorage.getItem('authUser');
    if (authUserstring) {
      return JSON.parse(authUserstring);
    } else {
      let authUser = await this.afAuth.currentUser;
      if (authUser) {
        // localStorage.setItem('authUser', JSON.stringify(authUser));
        const status = { loggedIn: true };
        localStorage.setItem('authUser', JSON.stringify(status));
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
