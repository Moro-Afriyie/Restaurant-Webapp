export interface Order {
  name: string;
  phoneNumber: string;
  location: string;
  paymentoption: string;
  amount: string;
  extraComments?: string;
  numberOfPacks: string;
  foodOrdered: string;
}

export interface PaymentResponse {
  status: string;
  reason: string;
  transactionid: number;
  clienttransid: string;
  clientreference: string | null;
  statusdate: string;
  brandtransid: string | null;
}

export interface Food {
  id: string;
  body: string;
  image: string;
  alt: string;
  price: string;
}

export interface OrderDetails {
  date: string;
  orderNumber: number;
  name: string;
  foodOrdered: string;
  phoneNumber: string;
  location: string;
  amount: string;
  completed: boolean;
}

export interface OrderDetailsAdmin {
  date: string;
  orderNumber: number;
  name: string;
  foodOrdered: string;
  phoneNumber: string;
  location: string;
  amount: string;
  completed: boolean;
  Id: string;
}
