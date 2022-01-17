import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  orderStatus = false;
  closeOrder = false;
  private socket: any;
  @Output('toggleSideBar') toggleSidebarEvent = new EventEmitter();
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private http: HttpClient
  ) {
    this.socket = io('https://restaurant-payment-backend.herokuapp.com/');
  }

  ngOnInit(): void {
    this.http
      .get('https://restaurant-payment-backend.herokuapp.com/')
      .subscribe((res: any) => {
        this.orderStatus = res.orderStatus;
        if (this.orderStatus) {
          this.closeOrder = true;
        }
      });

    this.socket.on('orderStatus', (res: { orderStatus: boolean }) => {
      this.orderStatus = res.orderStatus;
      if (res.orderStatus) {
        this.closeOrder = true;
      } else {
        this.closeOrder = false;
      }
    });
  }

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
      .post(
        'https://restaurant-payment-backend.herokuapp.com/api/openOrders',
        {},
        httpOptions
      )
      .subscribe();
  }

  onCloseOrders() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post(
        'https://restaurant-payment-backend.herokuapp.com/api/closeOrders',
        {},
        httpOptions
      )
      .subscribe();
  }

  onToggleSidebar(link: string) {
    this.router.navigate([link]);
    this.toggleSidebarEvent.emit(false);
  }
}
