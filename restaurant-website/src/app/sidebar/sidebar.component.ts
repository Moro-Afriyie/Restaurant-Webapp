import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  logOut(): void {
    this.authService
      .logOut()
      .then((res) => {
        this.router.navigate(['/login']);
      })
      .catch((err) => console.log(err));
  }

  onOpenOrders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post('http://localhost:8000/api/openOrders', {}, httpOptions)
      .subscribe();
  }

  onCloseOrders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post('http://localhost:8000/api/closeOrders', {}, httpOptions)
      .subscribe();
  }
}
