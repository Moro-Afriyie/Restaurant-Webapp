import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  constructor(private router: Router) {}

  foodArray = [
    {
      id: 1,
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '80.00',
    },
    {
      id: 2,
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '40.00',
    },
    {
      id: 3,
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '30.00',
    },
    {
      id: 4,
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '50.00',
    },
    {
      id: 5,
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '70.00',
    },
    {
      id: 6,
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '30.00',
    },
  ];

  ngOnInit(): void {}

  onProceedToOrderPage(): void {
    this.router.navigate(['/orders']);
  }
}
