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
import { cities } from '../models/accra';

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
    // this.socket = io('http://localhost:8000/');
  }

  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]),
    location: new FormControl('', Validators.required),
    // deliveryFee: new FormControl(''),
    // amount: new FormControl(0, Validators.required),
    numberOfPacks: new FormControl('1', Validators.required),
    note: new FormControl(''),
    foodOrdered: new FormControl('', Validators.required),
  });

  orderDetails: any;

  private socket: any;
  public data: any;
  modalOpen = false;

  url = 'https://restaurant-payment-backend.herokuapp.com/api/payment';
  // url = 'http://localhost:8000/api/payment';

  paymentError = false;
  paymentSuccess = false;
  submitted = false;
  error = 'Payment was not successful. Please try again';
  success = 'Successfully processed transaction.';
  paymentLoading = false;
  paymentReason = 'Processing payment...';
  price = '';
  locations: { name: string; price: number }[] = cities;
  invalidLocation = false;
  priceOfFood = '';
  deliveryFee = 0;
  totalPrice = 0;
  clientTransactionId = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id: any = params.get('id');
      const data: Food = this.socketService.getFoodByID(id);
      this.price = data.price;
      this.priceOfFood = data.price;
      this.orderForm.patchValue({
        // amount: data.price,
        amount: '0.01',
        foodOrdered: data.body,
      });
      this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
    });

    this.socket.on('notification', (res: any) => {
      this.data = res.data;
      if (this.clientTransactionId === this.data.clienttransid) {
        this.paymentReason = 'Processing payment...';

        if (this.data.status === 'FAILED') {
          this.paymentError = true;
          // this.paymentSuccess = false;
          this.paymentLoading = false;
          setTimeout(() => {
            this.paymentError = false;
          }, 4000);
        } else if (this.data.status === 'PAID') {
          this.paymentError = false;
          // this.paymentSuccess = true;
          this.paymentLoading = false;
          // this.postDetailsToFireBase(this.orderDetails);
          setTimeout(() => {
            // this.paymentSuccess = false;
            this.modalOpen = true;
          }, 500);
        }
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
    this.clientTransactionId = uuid;

    if (this.orderForm.invalid || this.invalidLocation) {
      return;
    }

    // set the orderDetails
    this.orderDetails = {
      date: Date.now().toString(),
      orderId: this.clientTransactionId,
      name: this.orderForm.value.name,
      foodOrdered: this.orderForm.value.foodOrdered,
      phoneNumber: this.orderForm.value.phoneNumber,
      amount: this.totalPrice,
      note: this.orderForm.value.note,
      completed: false,
      location: this.orderForm.value.location,
      deliveryFee: this.deliveryFee,
      priceOfFood: this.priceOfFood,
      orderPaid: false,
    };

    console.log(this.orderDetails);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const body = {
      amount: this.totalPrice,
      paymentoption: this.getPhoneNetWork(this.orderForm.value.phoneNumber),
      walletnumber: this.FormatGhanaianPhoneNumber(
        this.orderForm.value.phoneNumber
      ),
      clientId: this.clientTransactionId,
      orderDetails: this.orderDetails,
    };

    this.http
      .post<PaymentResponse>(this.url, body, httpOptions)
      .subscribe((res: PaymentResponse) => {
        this.paymentLoading = true;
        this.paymentReason = res.reason;
        if (res.status === 'FAILED') {
          this.paymentError = true;
          // this.paymentSuccess = false;
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
  FormatGhanaianPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.startsWith('0') && phoneNumber.length == 10) {
      return '233' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('0') && phoneNumber.length == 9) {
      return '233' + phoneNumber;
    } else if (phoneNumber.startsWith('233') && phoneNumber.length == 12) {
      return phoneNumber;
    } else if (phoneNumber.startsWith('+233') && phoneNumber.length == 13) {
      return phoneNumber.substring(1);
    }

    return phoneNumber;
  };

  onClose(): void {
    this.paymentError = false;
    // this.paymentSuccess = false;
  }

  calculateAmount(event: any) {
    let quantity = event.target.value;
    this.priceOfFood = (parseFloat(this.price) * parseInt(quantity)).toFixed(2);
    this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
    // this.orderForm.patchValue({
    //   amount: (parseFloat(this.price) * parseInt(quantity)).toFixed(2),
    // });
  }

  onCalculateFee(event: any): void {
    const selectedLocation = event.target.value;
    const city: { name: string; price: number } | undefined =
      this.locations.find((item) => item.name === selectedLocation);
    if (!city) {
      this.invalidLocation = true;
      // this.orderForm.patchValue({
      //   deliveryFee: '',
      // });
      this.deliveryFee = 0;
      this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
    } else {
      this.invalidLocation = false;
      // this.orderForm.patchValue({
      //   deliveryFee: city.price.toFixed(2),
      // });
      this.deliveryFee = city.price;
      this.totalPrice = this.getTotalPrice(this.deliveryFee, this.priceOfFood);
    }
  }

  getTotalPrice(deliveryFee: number, priceOfFood: string): number {
    // return deliveryFee + parseInt(priceOfFood);
    return 0.01;
  }
  onCloseModal(): void {
    this.modalOpen = false;
    this.router.navigate(['/']);
  }
}
