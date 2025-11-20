export interface ReservationI {
  id?: number;
  reservation_date: Date;
  start_date: Date;
  end_date: Date;
  number_of_guests: number;
  total_amount: number;
  client_id: number;
  room_id: number;
  rate_id: number;
  hotel_id: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT" | "PAID" | "INACTIVE";
}


export interface ReservationResponseI {
  id?: number;
  reservation_date: Date;
  start_date: Date;
  end_date: Date;
  number_of_guests: number;
  total_amount: number;
  client_id: number;
  room_id: number;
  rate_id: number;
  hotel_id: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT" | "PAID" | "INACTIVE";
}
