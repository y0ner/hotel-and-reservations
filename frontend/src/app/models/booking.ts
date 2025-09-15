// src/app/models/booking.ts

export interface BookingI {
  id?: number;
  guestId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada' | 'Pagada';
}