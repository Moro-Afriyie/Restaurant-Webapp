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
import { v4 as uuidv4 } from 'uuid';

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
    numberOfPacks: new FormControl('1', Validators.required),
    note: new FormControl('', Validators.required),
    foodOrdered: new FormControl('', Validators.required),
  });

  orderDetails: any;

  private socket: any;
  public data: any;

  url = 'https://restaurant-payment-backend.herokuapp.com/api/payment';
  paymentError = false;
  paymentSuccess = false;
  submitted = false;
  error = 'Payment was not successful. Please try again';
  success = 'Successfully processed transaction.';
  paymentLoading = false;
  paymentReason = 'Processing payment...';
  price = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id: any = params.get('id');
      const data: Food = this.socketService.getFoodByID(id);
      this.price = data.price;
      this.orderForm.patchValue({
        amount: data.price,
        foodOrdered: data.body,
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
        this.postDetailsToFireBase(this.orderDetails);
        setTimeout(() => {
          this.paymentSuccess = false;
          this.router.navigate(['']);
        }, 3000);
      }
    });
  }

  async postDetailsToFireBase(data: OrderDetails): Promise<void> {
    try {
      await this.createOrder(data);
    } catch (error) {
      console.log(error);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.orderForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    const uuid = uuidv4().split('-').slice(0, 2).join('');

    if (this.orderForm.invalid) {
      return;
    }

    // set the orderDetails
    this.orderDetails = {
      date: Date.now().toString(),
      orderId: uuid,
      name: this.orderForm.value.name,
      foodOrdered: this.orderForm.value.foodOrdered,
      phoneNumber: this.orderForm.value.phoneNumber,
      amount: this.orderForm.value.amount,
      note: this.orderForm.value.note,
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
      paymentoption: this.getPhoneNetWork(this.orderForm.value.phoneNumber),
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

  getPhoneNetWork(phoneNumber: string): string | null {
    let networkDeterminants = phoneNumber.substring(2, 3);
    if (
      networkDeterminants == '4' ||
      networkDeterminants == '5' ||
      networkDeterminants == '9'
    )
      return 'MTN';
    else if (networkDeterminants == '0') return 'VODAFONE';
    else if (networkDeterminants == '6' || networkDeterminants == '7')
      return 'AIRTELTIGO';

    return null;
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
