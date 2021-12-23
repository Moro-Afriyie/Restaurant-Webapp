import { EventEmitter, Injectable, Output } from '@angular/core';
import { Food } from '../models/interface';
import { io } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  orderStatusEvent: Subject<boolean> = new Subject<boolean>();
  constructor() {
    this.socket = io('http://localhost:8000/');
    this.socket.on('orderStatus', (res: { orderStatus: boolean }) => {
      this.orderStatus = res.orderStatus;
    });
    // console.log('orderStatus: ', this.orderStatus);
    // this.getOrderStatus();
  }
  success: boolean = false;
  // closingTime: string = '16:00:00';
  closingTime = '14:39:16';
  // openingTime = '07:00:00';
  openingTime = '9:10:00';
  orderStatus: boolean = false;
  foodArray: Food[] = [
    {
      id: '33cc84aebc4b49b9bdc181782680c493',
      body: 'Beans with plantain and egg',
      image: '../../assets/beans and egg.jpg',
      alt: 'Beans with plantain and egg',
      price: '15.00',
    },
    {
      id: '3646754e10574da3a16a90e2ecff5e06',
      body: 'Beans with plantain, egg and fish',
      image: '../../assets/closePackage.jpg',
      alt: 'Beans with plantain, egg and fish',
      price: '20.00',
    },
    {
      id: '4226d4f1e91e404880345bc18be88e5b',
      body: 'Beans with plantain, egg and meat',
      image: '../../assets/closePackage.jpg',
      alt: 'Beans with plantain, egg and meat',
      price: '20.00',
    },
    {
      id: 'ab62ad68aff443afa4c827a78a22e3a3',
      body: 'Beans with plantain, egg and chicken',
      image: '../../assets/BeansWithEggAndChicken.jpg',
      alt: 'Beans with plantain, egg and chicken',
      price: '20.00',
    },
    {
      id: '6fe15e03186f478b8c2399ae70a51960',
      body: 'Beans and rice with plantain and egg',
      image: '../../assets/RiceWithPlantainAndEgg.jpg',
      alt: 'Beans and rice with plantain and egg',
      price: '17.00',
    },
    {
      id: 'c4d3ddc886c540149323387915598847',
      body: 'Beans and rice with plantain, egg and chicken',
      image: '../../assets/BeansWithEggAndChicken.jpg',
      alt: 'Beans and rice with plantain, egg and chicken',
      price: '25.00',
    },
    {
      id: 'ddbf19c31b9c4844865bf59fbb8fc985',
      body: 'Beans and rice with plantain, egg and meat',
      image: '../../assets/closePackage.jpg',
      alt: 'Beans and rice with plantain, egg and meat',
      price: '25.00',
    },
    {
      id: '4d2da93389ce48aa8841c56891494942',
      body: 'Beans and rice with plantain, egg and fish',
      image: '../../assets/riceWithFishAndEgg.jpg',
      alt: 'Beans and rice with plantain, egg and fish',
      price: '25.00',
    },
    {
      id: '91fcca31cba046fea468af2c659bcf86',
      body: 'Beans and rice with plantain, egg, fish and meat',
      image: '../../assets/closePackage.jpg',
      alt: 'Beans and rice with plantain, egg, fish and meat',
      price: '30.00',
    },
  ];

  getFoodByID(id: string): Food {
    return this.foodArray.filter((item) => item.id === id)[0];
  }

  getAllFoods(): Food[] {
    return this.foodArray;
  }

  getClosingTime(): { closingTime: string; openingTime: string } {
    return { closingTime: this.closingTime, openingTime: this.openingTime };
  }

  getOrderStatus(): boolean {
    // console.log('orderStatus: ', this.orderStatus);
    this.emitOrderStatusEvent(true);
    return this.orderStatus;
  }

  emitOrderStatusEvent(status: boolean) {
    this.orderStatusEvent.next(status);
  }
  getOrderStatusEmitter(): any {
    return this.orderStatusEvent.asObservable();
  }

  getOrder(): any {
    return Observable.create((observer: any) => {
      this.socket.on('orderStatus', (message: any) => {
        observer.next(message);
      });
    });
  }
}
