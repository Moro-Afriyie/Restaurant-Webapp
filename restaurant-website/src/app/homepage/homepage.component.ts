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
    this.socket = io('http://localhost:8000/');
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
    // console.log('intial orderStatus: ', this.orderStatus);
    // this.socket.on('time', (res: { time: string }) => {
    //   this.breakTime = this.socketService.getClosingTime();
    //   this.currentTime = res.time;
    //   console.log('order status ', this.orderStatus);
    //   if (
    //     this.currentTime < this.breakTime.openingTime ||
    //     this.currentTime > this.breakTime.closingTime
    //   ) {
    //     this.closingTimeError = true;
    //   } else {
    //     this.closingTimeError = false;
    //   }
    // });

    this.http.get('http://localhost:8000/').subscribe((res: any) => {
      this.orderStatus = res.orderStatus;
      console.log('order status: ', this.orderStatus);
      if (this.orderStatus) {
        this.closingTimeError = true;
      } else {
        this.closingTimeError = false;
      }
    });

    this.socket.on('orderStatus', (res: { orderStatus: boolean }) => {
      this.orderStatus = res.orderStatus;
      // this.changeOrderStatus(res.orderStatus);
      console.log('order status from socket: ', this.orderStatus);
      if (res.orderStatus) {
        this.closingTimeError = true;
      } else {
        this.closingTimeError = false;
      }
    });

    this.socketService.emitOrderStatusEvent(true);

    this.subscription = this.socketService
      .getOrderStatusEmitter()
      .subscribe((res: any) => {
        if (res) {
          console.log('ony3');
        } else {
          console.log('res', res);
        }
      });

    // this.http.get('http://localhost:8000/').subscribe((res: any) => {
    //   this.orderStatus = res.orderStatus;
    //   console.log('order status: ', this.orderStatus);
    //   if (this.orderStatus) {
    //     this.closingTimeError = true;
    //   }
    // });

    this.foodArray = this.socketService.getAllFoods();
  }

  onProceedToOrderPage(id: number): void {
    const currentDate = new Date();
    const currentTime = currentDate.toString().split(' ')[4].toString();
    console.log(this.orderStatus);
    if (
      this.currentTime < this.breakTime.openingTime ||
      this.currentTime > this.breakTime.closingTime
    ) {
      this.closingTimeError = true;
      return;
    } else {
      this.closingTimeError = false;
      this.router.navigate(['/orders', id]);
    }
  }

  changeOrderStatus(status: boolean): void {
    this.orderStatus = status;
    console.log(this.orderStatus);
    if (this.orderStatus) {
      this.closingTimeError = true;
    }
  }
}
