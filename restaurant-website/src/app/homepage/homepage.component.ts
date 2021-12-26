import { SocketService } from './../services/socket-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  private socket: any;
  constructor(
    private router: Router,
    private socketService: SocketService,
    private http: HttpClient
  ) {
    this.socket = io('https://restaurant-payment-backend.herokuapp.com/');
  }

  foodArray: any;
  closingTime: string = '';
  currentTime: string = '';
  public orderStatus: boolean = false;
  breakTime: { closingTime: string; openingTime: string } = {
    closingTime: '',
    openingTime: '',
  };
  closingTimeError = false;
  subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.breakTime = this.socketService.getClosingTime();
    this.http
      .get('https://restaurant-payment-backend.herokuapp.com/')
      .subscribe((res: any) => {
        this.orderStatus = res.orderStatus;
        const currentDate = new Date();
        const currentTime = currentDate.toString().split(' ')[4].toString();
        if (
          currentTime < this.breakTime.openingTime ||
          currentTime > this.breakTime.closingTime ||
          this.orderStatus
        ) {
          this.closingTimeError = true;
        } else {
          this.closingTimeError = false;
        }
      });

    this.socket.on('orderStatus', (res: { orderStatus: boolean }) => {
      this.orderStatus = res.orderStatus;
      if (res.orderStatus) {
        this.closingTimeError = true;
      } else {
        this.closingTimeError = false;
      }
    });

    this.foodArray = this.socketService.getAllFoods();
  }

  onProceedToOrderPage(id: number): void {
    const currentDate = new Date();
    const currentTime = currentDate.toString().split(' ')[4].toString();
    if (
      currentTime < this.breakTime.openingTime ||
      currentTime > this.breakTime.closingTime ||
      this.orderStatus
    ) {
      this.closingTimeError = true;
    } else {
      this.closingTimeError = false;
      this.router.navigate(['/orders', id]);
    }
  }
}
