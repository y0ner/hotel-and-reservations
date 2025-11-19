export interface LoginI {
  email: string;
  password: string;
}

export interface HotelDataI {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  stars: number;
}

export interface UserI {
  id: number;
  username: string;
  email: string;
  password: string;
  is_active: "ACTIVE" | "INACTIVE";
  avatar: string;
  hotel_id: number;
  Hotel?: HotelDataI;
}

export interface LoginResponseI {
  token: string;
  user: UserI;
}

export interface RegisterI {
  username: string;  
  email: string;
  password: string;
  hotel_id: number;
}

export interface RegisterResponseI {
  token: string;
  user: UserI;
}
