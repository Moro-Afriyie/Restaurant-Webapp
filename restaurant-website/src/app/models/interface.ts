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
  orderId: string;
  name: string;
  foodOrdered: string[];
  phoneNumber: string;
  location: string;
  amount: string;
  note?: string;
  completed: boolean;
  deliveryFee: number;
  priceOfFood: string;
  orderPaid: boolean;
  numberOfPacks: {[key: string]: number};
}

export interface OrderDetailsAdmin {
  date: string;
  orderId: string;
  name: string;
  foodOrdered: string[];
  phoneNumber: string;
  location: string;
  amount: string;
  note?: string;
  completed: boolean;
  Id: string;
  numberOfPacks: {[key: string]: number}[];
  deliveryFee: number;
  priceOfFood: string;
  orderPaid: boolean;
}
