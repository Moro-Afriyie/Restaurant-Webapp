import { OrderDetails } from './../models/interface';
import { SocketService } from './../services/socket-service.service';
import { Router, ActivatedRoute } from '@angular/router';
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
import { PaymentResponse, Order, Food } from '../models/interface';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent implements OnInit {
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private socketService: SocketService,
    private route: ActivatedRoute
  ) {
    this.socket = io('https://restaurant-payment-backend.herokuapp.com');
  }

  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    location: new FormControl('', Validators.required),
    amount: new FormControl(0, Validators.required),
    paymentoption: new FormControl('MTN', Validators.required),
    numberOfPacks: new FormControl('1', Validators.required),
    foodOrdered: new FormControl('', Validators.required),
  });

  orderDetails: OrderDetails = {
    date: new Date(),
    orderNumber: 0,
    name: '',
    foodOrdered: '',
    phoneNumber: '',
    location: '',
    amount: '',
    completed: false,
  };

  private socket: any;
  public data: any;

  url = 'https://restaurant-payment-backend.herokuapp.com/api/payment';
  paymentError = false;
  paymentSuccess = false;
  submitted = false;
  error = 'Payment was not successful. Please try again';
  success = 'Successfully processed transaction.';
  paymentLoading = false;
  number = '233501658639';
  paymentReason = 'Processing payment...';
  price = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id: any = params.get('id');
      const data: Food = this.socketService.getFoodByID(id);
      this.price = data.price;
      this.orderForm.patchValue({
        // amount: data.price,
        amount: '0.01',
      });
    });

    this.socket.on('notification', (res: any) => {
      this.data = res.data;
      this.paymentReason = 'Processing payment...';
      if (this.data.status === 'FAILED') {
        this.paymentError = true;
        this.paymentSuccess = false;
        this.paymentLoading = false;
        setTimeout(() => {
          this.paymentError = false;
        }, 4000);
      } else if (this.data.status === 'PAID') {
        this.paymentError = false;
        this.paymentSuccess = true;
        this.paymentLoading = false;
        setTimeout(() => {
          this.paymentSuccess = false;
          window.open(
            `https://wa.me/${this.number}?text=name%3A%20${this.orderForm.value.name}%20%0APhone%20Number%3A%20${this.orderForm.value.phoneNumber}%20%0Alocation%3A%20${this.orderForm.value.location}`,
            '_blank'
          );
          this.router.navigate(['']);
        }, 3000);
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
    // console.log(this.orderForm.value);

    if (this.orderForm.invalid) {
      return;
    }

    // set the orderDetails
    this.orderDetails = {
      date: new Date(),
      orderNumber: 2,
      name: this.orderForm.value.name,
      foodOrdered: '',
      phoneNumber: this.orderForm.value.phoneNumber,
      amount: this.orderForm.value.amount,
      completed: false,
      location: this.orderForm.value.location,
    };
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
        this.paymentLoading = true;
        this.paymentReason = res.reason;
        // console.log(res);
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
  }

  createOrder(data: OrderDetails) {
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

  calculateAmount(event: any) {
    let quantity = event.target.value;
    this.orderForm.patchValue({
      amount: (parseFloat(this.price) * parseInt(quantity)).toFixed(2),
    });
  }
}
