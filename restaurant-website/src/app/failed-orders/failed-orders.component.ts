import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OrderDetailsAdmin } from '../models/interface';
import { OrderType } from '../single-order/single-order.component';

@Component({
  selector: 'app-failed-orders',
  templateUrl: './failed-orders.component.html',
  styleUrls: ['./failed-orders.component.scss'],
})
export class FailedOrdersComponent implements OnInit {
  item$: Observable<OrderDetailsAdmin[]>;
  OrderType = OrderType;
  constructor(private firestore: AngularFirestore) {
    this.item$ = this.exampleGetCollection();
  }

  success: boolean = false;

  ngOnInit(): void {}

  exampleGetCollection(): Observable<any> {
    return this.firestore
      .collection('orders', (orders) =>
        orders
          .where('completed', '==', false)
          .where('orderPaid', '==', false)
          .orderBy('date', 'desc')
      )
      .valueChanges({ idField: 'Id' });
  }

  onOrderDelivered(id: string, orderId: string): void {
    if (window.confirm(`Are you sure you want to comfirm oder: ${orderId}?`)) {
      this.updateOrder(id, { completed: true })
        // .then((res) => console.log(res))
        .catch((err) => console.log(err));
      this.success = true;
    }
  }

  onCancelOrder(id: string, orderId: string) {
    if (window.confirm(`Do you really want to delete oder: ${orderId}?`)) {
      this.deleteOrder(id)
        // .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }

  updateOrder(id: string, data: { completed: boolean }): Promise<void> {
    return this.firestore.collection('orders').doc(id).update(data);
  }

  deleteOrder(id: string): Promise<void> {
    return this.firestore.collection('orders').doc(id).delete();
  }
}
