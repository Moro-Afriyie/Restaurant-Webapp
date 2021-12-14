import { OrderDetails } from './../models/interfaces';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Order {
  // foodName: string;
  name: string;
  phoneNumber: string;
  location: string;
  extraComments?: string;
}

@Component({
  selector: 'app-display-page',
  templateUrl: './display-page.component.html',
  styleUrls: ['./display-page.component.scss'],
})
export class DisplayPageComponent implements OnInit {
  item$: Observable<OrderDetails[]>;
  constructor(private firestore: AngularFirestore) {
    this.item$ = this.exampleGetCollection();
    this.exampleGetCollection().subscribe((res: OrderDetails[]) => {
      console.log(res);
    });
  }

  /**
   * [ngStyle]="
        success
          ? { 'background-color': '#cbcbcb' }
          : { 'background-color': '#ffffff' }
      "
   */

  success: boolean = false;

  ngOnInit(): void {
    console.log(this.exampleGetCollection());
  }

  exampleGetCollection(): Observable<any> {
    return this.firestore.collection('orders').valueChanges({ idField: 'Id' });
  }

  onOrderDelivered(id: string): void {
    console.log(id);
    this.updateOrder(id, { completed: true })
      // .then((res) => console.log(res))
      .catch((err) => console.log(err));
    this.success = true;
  }

  onCancelOrder(id: string) {
    this.deleteOrder(id)
      // .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  updateOrder(id: string, data: { completed: boolean }): Promise<void> {
    return this.firestore.collection('orders').doc(id).update(data);
  }

  deleteOrder(id: string): Promise<void> {
    return this.firestore.collection('orders').doc(id).delete();
  }
}
