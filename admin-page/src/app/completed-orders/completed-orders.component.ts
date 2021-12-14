import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { OrderDetails } from '../models/interfaces';

@Component({
  selector: 'app-completed-orders',
  templateUrl: './completed-orders.component.html',
  styleUrls: ['./completed-orders.component.scss'],
})
export class CompletedOrdersComponent implements OnInit {
  item$: Observable<OrderDetails[]>;

  constructor(private firestore: AngularFirestore) {
    this.item$ = this.GetCompletedOrdersCollection();
  }

  ngOnInit(): void {
    this.firestore
      .collection('orders', (orders) => orders.where('completed', '==', true))
      .valueChanges()
      .subscribe((res) => console.log(res));
  }

  GetCompletedOrdersCollection(): Observable<any> {
    return this.firestore
      .collection('orders', (orders) => orders.where('completed', '==', true))
      .valueChanges();
  }
}
