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
      id: '33cc84ae-bc4b-49b9-bdc1-81782680c493',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '80.00',
    },
    {
      id: '3646754e-1057-4da3-a16a-90e2ecff5e06',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '40.00',
    },
    {
      id: '4226d4f1-e91e-4048-8034-5bc18be88e5b',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '30.00',
    },
    {
      id: 'ab62ad68-aff4-43af-a4c8-27a78a22e3a3',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '50.00',
    },
    {
      id: '6fe15e03-186f-478b-8c23-99ae70a51960',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '70.00',
    },
    {
      id: 'c4d3ddc8-86c5-4014-9323-387915598847',
      body: 'Lorem ipsum dolor sit amet consectetur',
      image: '../../assets/pizza2.jpg',
      alt: 'pizza',
      price: '30.00',
    },
  ];

  getFoodByID(id: string): any {
    return this.foodArray.filter((item) => item.id === id)[0];
  }

  getAllFoods(): any {
    return this.foodArray;
  }
}
