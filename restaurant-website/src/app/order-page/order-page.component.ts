import { SocketService } from './../services/socket-service.service';
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
    this.socket = io('https://restaurant-payment-backend.herokuapp.com');
  }
  url = 'https://restaurant-payment-backend.herokuapp.com/api/payment';
  paymentError = false;
  paymentSuccess = false;
  submitted = false;
  error = 'Payment was not successful. Please try again';
  success = 'Successfully processed transaction.';
  paymentLoading = false;

  ngOnInit(): void {
    this.socket.on('notification', (res: any) => {
      this.data = res.data;
      console.log('data: ', this.data);
      if (this.data.status === 'FAILED') {
        this.paymentError = true;
        this.paymentSuccess = false;
        this.paymentLoading = false;
        this.socketService.setPaymentSuccess(true);
        setTimeout(() => {
          this.paymentError = false;
        }, 4000);
      } else if (this.data.status === 'PAID') {
        this.paymentError = false;
        this.paymentSuccess = true;
        this.paymentLoading = false;
        setTimeout(() => {
          this.paymentSuccess = false;
          this.socketService.setPaymentSuccess(true);
          //   window.open(
          //     `https://wa.me/${this.number}?text=name%3A%20${this.orderForm.value.name}%20%0APhone%20Number%3A%20${this.orderForm.value.phoneNumber}%20%0Alocation%3A%20${this.orderForm.value.location}`,
          //     '_blank'
          //   );
          //   // this.router.navigate(['']);
        }, 2000);
      }
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
        this.paymentLoading = true;
        if (res.status === 'FAILED') {
          this.paymentError = true;
          this.paymentSuccess = false;
          this.paymentLoading = false;
          this.error = res.reason;
          setTimeout(() => {
            this.paymentError = false;
          }, 4000);
        }
      });
    // if(this.paymentSuccess){

    // }
    console.log('payment success: ', this.socketService.onGetPaymentSuccess());
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
