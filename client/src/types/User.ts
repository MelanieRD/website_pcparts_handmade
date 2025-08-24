export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'customer';
    avatar?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }