import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor() {}
  success: boolean = false;
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

  getFoodByID(id: number): any {
    return this.foodArray.filter((item) => item.id === id)[0];
  }

  getAllFoods(): any {
    return this.foodArray;
  }
}
