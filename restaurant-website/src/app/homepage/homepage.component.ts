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

  ngOnInit(): void {
    this.foodArray = this.socketService.getAllFoods();
  }

  onProceedToOrderPage(id: number): void {
    this.router.navigate(['/orders', id]);
  }
}
