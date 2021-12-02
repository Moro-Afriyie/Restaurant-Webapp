import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}
  success: boolean = false;

  // emit event
  PaymentResponse() {
    this.socket.emit('paymentResponse');
  }

  // listen event
  OnGetPaymentResponse(): any {
    return this.socket.fromEvent('paymentResponse');
  }

  setPaymentSuccess(data: boolean) {
    this.success = data;
  }

  onGetPaymentSuccess(): boolean {
    return this.success;
  }
}
