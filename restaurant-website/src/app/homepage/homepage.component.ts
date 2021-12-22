import { SocketService } from './../services/socket-service.service';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { io } from 'socket.io-client';
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
  breakTime: { closingTime: string; openingTime: string } = {
    closingTime: '',
    openingTime: '',
  };
  closingTimeError = false;

  ngOnInit(): void {
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

  onClose() {}
}
