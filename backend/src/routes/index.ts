import { Router } from "express";

import { UserRoutes } from "./authorization/user";
import { RoleRoutes } from "./authorization/role";
import { RoleUserRoutes } from "./authorization/role_user";
import { AuthRoutes } from "./authorization/auth";
import { RefreshTokenRoutes } from "./authorization/refresk_token";
import { ResourceRoutes } from "./authorization/resource";
import { ResourceRoleRoutes } from "./authorization/resourceRole"
import { GuestRoutes } from "./guest";
import { RoomRoutes } from "./room"; 
import { BookingRoutes } from "./booking"; // <-- Añade esta línea
import { ServiceRoutes } from "./service"; 
import { InvoiceRoutes } from "./invoice";
import { SettingRoutes } from "./setting"; // <-- Añade esta línea

export class Routes {

  public userRoutes: UserRoutes = new UserRoutes();
  public roleRoutes: RoleRoutes = new RoleRoutes();
  public roleUserRoutes: RoleUserRoutes = new RoleUserRoutes();
  public authRoutes: AuthRoutes = new AuthRoutes();
  public refreshTokenRoutes: RefreshTokenRoutes = new RefreshTokenRoutes();
  public resourceRoutes: ResourceRoutes = new ResourceRoutes();
  public resourceRoleRoutes: ResourceRoleRoutes = new ResourceRoleRoutes();
  public guestRoutes: GuestRoutes = new GuestRoutes();
  public roomRoutes: RoomRoutes = new RoomRoutes(); 
  public bookingRoutes: BookingRoutes = new BookingRoutes(); 
  public serviceRoutes: ServiceRoutes = new ServiceRoutes(); 
  public invoiceRoutes: InvoiceRoutes = new InvoiceRoutes();
  public settingRoutes: SettingRoutes = new SettingRoutes(); // <-- Añade esta línea

  
}