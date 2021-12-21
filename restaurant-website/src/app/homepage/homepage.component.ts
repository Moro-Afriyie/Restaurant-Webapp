import { SocketService } from './../services/socket-service.service';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  constructor(private router: Router, private socketService: SocketService) {}

  foodArray: any;
  closingTime: string = '';
  breakTime: { closingTime: string; openingTime: string } = {
    closingTime: '',
    openingTime: '',
  };
  closingTimeError = false;

  ngOnInit(): void {
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
    if (currentTime <= this.closingTime) {
      this.router.navigate(['/orders', id]);
    } else {
      this.closingTimeError = true;
      return;
    }
  }

  onClose() {}
}
