import { OrderDetailsAdmin } from './../models/interface';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { OrderType } from '../single-order/single-order.component';

@Component({
  selector: 'app-completed-orders',
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.scss'],
})
export class CompletedOrdersComponent implements OnInit {
  item$: Observable<OrderDetailsAdmin[]>;
  OrderType = OrderType;
  constructor(private firestore: AngularFirestore) {
    this.item$ = this.GetCompletedOrdersCollection();
  }

  ngOnInit(): void {
    // this.firestore
    //   .collection('orders', (orders) => orders.where('completed', '==', true))
    //   .valueChanges()
    //   .subscribe((res) => console.log(res));
  }

  GetCompletedOrdersCollection(): Observable<any> {
    return this.firestore
      .collection('orders', (orders) =>
        orders.where('completed', '==', true).orderBy('date', 'desc')
      )
      .valueChanges({ idField: 'Id' });
  }
}
