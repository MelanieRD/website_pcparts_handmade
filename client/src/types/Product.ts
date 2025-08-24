export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    images: string[];
    category: 'computer' | 'handmade';
    subcategory: string;
    description: string;
    fullDescription: string;
    specifications?: Record<string, string>;
    inStock: boolean;
    rating: number;
    reviews: number;
    brand?: string;
    model?: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }