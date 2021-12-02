import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { SocketService } from '../services/socket-service.service';
import { io } from 'socket.io-client';

interface Order {
  name: string;
  phoneNumber: string;
  location: string;
  paymentoption: string;
  amount: string;
  extraComments?: string;
}

interface PaymentResponse {
  status: string;
  reason: string;
  transactionid: number;
  clienttransid: string;
  clientreference: string | null;
  statusdate: string;
  brandtransid: string | null;
}

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    location: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
    paymentoption: new FormControl('MTN', Validators.required),
  });

  private socket: any;
  public data: any;

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private socketService: SocketService
  ) {
    this.socket = io('http://127.0.0.1:8000');
  }
  number = '233501658639';
  // url = 'https://restaurant-payment-backend.herokuapp.com/api/payment';
  url = 'http://localhost:8000/api/payment';
  paymentError = false;
  paymentSuccess = false;
  submitted = false;
  error = 'An unexpected error occured. Please try again';
  success = 'Successfully processed transaction.';

  ngOnInit(): void {
    // this.socketService.PaymentResponse();
    // this.socketService
    //   .OnGetPaymentResponse()
    //   .subscribe((data: any) => console.log('data', data));
    this.socket.on('notification', (res: any) => {
      this.data = res.data;
      console.log(this.data);
    });
  }

  // async onSubmit(): Promise<void> {
  //   try {
  //     await this.createOrder(this.orderForm.value);
  //     this.router.navigate(['']);
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }

  // convenience getter for easy access to form fields
  get f() {
    return this.orderForm.controls;
  }

  onSubmit(): void {
    // window.open(
    //   `https://wa.me/${this.number}?text=name%3A%20${this.orderForm.value.name}%20%0APhone%20Number%3A%20${this.orderForm.value.phoneNumber}%20%0Alocation%3A%20${this.orderForm.value.location}`,
    //   '_blank'
    // );
    // this.router.navigate(['']);
    this.submitted = true;
    if (this.orderForm.invalid) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const body = {
      amount: this.orderForm.value.amount,
      paymentoption: this.orderForm.value.paymentoption,
      walletnumber: `233${this.orderForm.value.phoneNumber.substring(
        1,
        this.orderForm.value.phoneNumbernumber
      )}`,
    };

    this.http
      .post<PaymentResponse>(this.url, body, httpOptions)
      .subscribe((res: PaymentResponse) => {
        console.log(res);
        if (res.status === 'FAILED') {
          this.paymentError = true;
          this.paymentSuccess = false;
          this.error = res.reason;
          setTimeout(() => {
            this.paymentError = false;
          }, 5000);
        } else {
          this.paymentError = false;
          this.paymentSuccess = true;
          // setTimeout(() => {
          //   window.open(
          //     `https://wa.me/${this.number}?text=name%3A%20${this.orderForm.value.name}%20%0APhone%20Number%3A%20${this.orderForm.value.phoneNumber}%20%0Alocation%3A%20${this.orderForm.value.location}`,
          //     '_blank'
          //   );
          //   // this.router.navigate(['']);
          // }, 2000);

          // this.socketService.PaymentResponse();
          // this.socketService
          //   .OnGetPaymentResponse()
          //   .subscribe((data: any) => console.log('data2: ', data));
        }
      });
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

  onClose(): void {
    this.paymentError = false;
    this.paymentSuccess = false;
  }
}
