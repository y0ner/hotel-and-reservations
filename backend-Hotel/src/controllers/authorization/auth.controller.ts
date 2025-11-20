import { Request, Response } from 'express';
import { User } from '../../models/authorization/User';
import { Hotel } from '../../models/Hotel';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, is_active, avatar, hotel_id } = req.body;

      // Ensure there is a hotel_id to satisfy FK constraint on users.
      let finalHotelId = hotel_id;
      if (!finalHotelId) {
        // If no hotel exists, create a default hotel and use its id.
        const existingHotels = await (await import('../../models/Hotel')).Hotel.findAll();
        if (!existingHotels || existingHotels.length === 0) {
          const { Hotel } = await import('../../models/Hotel');
          const defaultHotel = await Hotel.create({
            name: 'Default Hotel',
            address: 'Default Address',
            city: 'Default City',
            country: 'Default Country',
            phone: '',
            stars: 3,
            status: 'ACTIVE'
          } as any);
          finalHotelId = (defaultHotel as any).id;
        } else {
          // use first existing hotel id
          finalHotelId = (existingHotels[0] as any).id;
        }
      }

      const user_interface: User = await User.create({ username, email, password, is_active, avatar, hotel_id: finalHotelId });
      const userWithHotel = await User.findByPk(user_interface.id, {
        include: [{ model: Hotel }]
      });
      const token = user_interface.generateToken();
      res.status(201).json({ user: userWithHotel, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user: User | null = await User.findOne(
        { 
          where: { 
            email,
            is_active: true 
          },
          include: [{ model: Hotel }]
      });
      if (!user || !(await user.checkPassword(password))) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
      const token = user.generateToken();
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

}