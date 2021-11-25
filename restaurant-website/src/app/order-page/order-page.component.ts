import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

interface Order {
  // foodName: string;
  name: string;
  phoneNumber: string;
  location: string;
  paymentoption: string;
  amount: string;
  extraComments?: string;
}

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    network: new FormControl('MTN', Validators.required),
  });

  constructor(private router: Router, private firestore: AngularFirestore) {}
  number: string = '233501658639';

  ngOnInit(): void {}

  // async onSubmit(): Promise<void> {
  //   try {
  //     await this.createOrder(this.orderForm.value);
  //     this.router.navigate(['']);
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

  onSubmit(): void {
    // window.open(
    //   `https://wa.me/${this.number}?text=name%3A%20${this.orderForm.value.name}%20%0APhone%20Number%3A%20${this.orderForm.value.phoneNumber}%20%0Alocation%3A%20${this.orderForm.value.location}`,
    //   '_blank'
    // );
    // this.router.navigate(['']);
    console.log(this.orderForm.value);
  }

  createOrder(data: Order) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('orders')
        .add(data)
        .then(
          (res) => {
            resolve(res);
          },
          (err) => reject(err)
        );
    });
  }
}
