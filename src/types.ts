export interface Burger {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Burger {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  userId: string;
  userEmail: string;
  status: 'pending' | 'completed' | 'delivered' | 'ready';
  adminMessage?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
}
