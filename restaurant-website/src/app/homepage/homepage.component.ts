import { SocketService } from './../services/socket-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  private socket: any;
  constructor(private router: Router, private socketService: SocketService) {
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

  ngOnInit(): void {
    // console.log('intial orderStatus: ', this.orderStatus);
    this.socket.on('time', (res: { data: string }) => {
      this.breakTime = this.socketService.getClosingTime();
      this.currentTime = res.data;
      if (
        this.currentTime < this.breakTime.openingTime ||
        this.currentTime > this.breakTime.closingTime
      ) {
        this.closingTimeError = true;
      } else {
        this.closingTimeError = false;
      }
    });
    // this.socket.on('orderStatus', (res: { orderStatus: boolean }) => {
    //   // this.orderStatus = res.orderStatus;
    //   this.changeOrderStatus(res.orderStatus);
    //   // console.log(this.orderStatus);
    //   // if (res.orderStatus) {
    //   //   this.closingTimeError = true;
    //   // }
    // });

    console.log(this.orderStatus);
    this.foodArray = this.socketService.getAllFoods();
  }

  onProceedToOrderPage(id: number): void {
    const currentDate = new Date();
    const currentTime = currentDate.toString().split(' ')[4].toString();
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
