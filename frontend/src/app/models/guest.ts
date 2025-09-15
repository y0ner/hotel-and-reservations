// src/app/models/guest.ts

export interface GuestI {
  id?: number;
  name: string;
  documentNumber: string; // Cambiamos 'address' por número de documento
  phone: string;
  email: string;
  // La contraseña no es necesaria para un huésped, la eliminamos.
  status: "ACTIVE" | "INACTIVE";
}