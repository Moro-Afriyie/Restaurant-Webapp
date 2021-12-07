import { Injectable } from '@angular/core';
import { Food } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor() {}
  success: boolean = false;
  foodArray: Food[] = [
    {
      id: '33cc84aebc4b49b9bdc181782680c493',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '80.00',
    },
    {
      id: '3646754e10574da3a16a90e2ecff5e06',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '40.00',
    },
    {
      id: '4226d4f1e91e404880345bc18be88e5b',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '30.00',
    },
    {
      id: 'ab62ad68aff443afa4c827a78a22e3a3',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '50.00',
    },
    {
      id: '6fe15e03186f478b8c2399ae70a51960',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '70.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598847',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '30.00',
    },
  ];

  getFoodByID(id: string): Food {
    return this.foodArray.filter((item) => item.id === id)[0];
  }

  getAllFoods(): Food[] {
    return this.foodArray;
  }
}
