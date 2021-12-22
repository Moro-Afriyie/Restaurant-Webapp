import { SocketService } from './../services/socket-service.service';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  private socket: any;
  constructor(private router: Router, private socketService: SocketService) {
    this.socket = io('http//:localhost:8000');
  }

  foodArray: any;
  closingTime: string = '';
  breakTime: { closingTime: string; openingTime: string } = {
    closingTime: '',
    openingTime: '',
  };
  closingTimeError = false;

  ngOnInit(): void {
    this.socket.on('time', (res: Date) => {
      console.log(res);
    });

    this.foodArray = this.socketService.getAllFoods();
    this.breakTime = this.socketService.getClosingTime();
    const currentDate = new Date();
    const currentTime = currentDate.toString().split(' ')[4].toString();
    console.log(this.breakTime);
    if (
      currentTime < this.breakTime.openingTime ||
      currentTime > this.breakTime.closingTime
    ) {
      this.closingTimeError = true;
    }
  }

  onProceedToOrderPage(id: number): void {
    const currentDate = new Date();
    const currentTime = currentDate.toString().split(' ')[4].toString();
    if (
      currentTime < this.breakTime.openingTime ||
      currentTime > this.breakTime.closingTime
    ) {
      this.closingTimeError = true;
      return;
    } else {
      this.router.navigate(['/orders', id]);
    }
  }

  onClose() {}
}
