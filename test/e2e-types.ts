export interface LoginResponse {
  access_token: string;
}

export interface OrderResponse {
  id: number;
  customerId: number;
  driverId?: number | null;
  pickupAddress: string;
  dropoffAddress: string;
  comfortLevel: string;
  status: string;
  distanceMeters?: number | null;
  priceByn?: string | null;
  createdAt?: string;
}

export interface ReviewResponse {
  id: number;
  orderId: number;
  rating: number;
  comment?: string | null;
}

export interface DriverApplicationResponse {
  id: number;
  email: string;
  name: string;
  phone: string;
  status: string;
}
