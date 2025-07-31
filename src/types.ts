export interface Product {
  name: string;
  reference: string;
}

export type PaymentMethod = 'card' | 'check' | 'cash' | 'transfer';

export interface Order {
  id: string;
  customerName: string;
  address: string;
  email?: string;
  phone?: string;
  products: Product[];
  invoiceNumber: string;
  totalAmount: number;
  date: string;
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
}

