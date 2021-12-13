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
  item$: Observable<Order[]>;
  constructor(private firestore: AngularFirestore) {
    this.item$ = this.exampleGetCollection();
    this.exampleGetCollection().subscribe((res) => {
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

  onSuccessDelivery(): void {
    this.success = true;
  }
}
