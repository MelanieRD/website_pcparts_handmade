export interface Sale {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
    customerEmail: string;
    customerName: string;
    date: string;
    status: 'pending' | 'completed' | 'cancelled';
  }