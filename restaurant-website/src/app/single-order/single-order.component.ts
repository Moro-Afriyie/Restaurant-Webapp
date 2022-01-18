import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderDetailsAdmin } from '../models/interface';

interface Order {
  // foodName: string;
  name: string;
  phoneNumber: string;
  location: string;
  extraComments?: string;
}

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
})
export class SingleOrderComponent implements OnInit {
  OrderType = OrderType;

  @Input('item') item: OrderDetailsAdmin = {} as OrderDetailsAdmin;
  @Input('orderType') orderType: OrderType = OrderType.failed;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {}

  success: boolean = false;

  onOrderDelivered(id: string, orderId: string): void {
    if (window.confirm(`Are you sure you want to comfirm oder: ${orderId}?`)) {
      this.updateOrder(id, { completed: true })
        // .then((res) => (res))
        .catch((err) => {});
      this.success = true;
    }
  }

  onCancelOrder(id: string, orderId: string) {
    if (window.confirm(`Do you really want to delete oder: ${orderId}?`)) {
      this.deleteOrder(id)
        // .then((res) => (res))
        .catch((err) => err);
    }
  }

  updateOrder(id: string, data: { completed: boolean }): Promise<void> {
    return this.firestore.collection('orders').doc(id).update(data);
  }

  deleteOrder(id: string): Promise<void> {
    return this.firestore.collection('orders').doc(id).delete();
  }
}

export enum OrderType {
  completed = 0,
  failed = 1,
  pendingOrder = 2,
}
