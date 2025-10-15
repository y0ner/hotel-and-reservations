// Importamos la instancia de faker
import { faker } from '@faker-js/faker';

// Importamos todos los modelos que vamos a poblar
import { Guest } from '../models/Guest';
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { Invoice } from '../models/Invoice';
import { Setting } from '../models/Setting';
import { sequelize } from '../database/db';
import { BookingService } from '../models/BookingService';
import { User } from '../models/authorization/User'; // Importamos el modelo User

const GUESTS_TO_CREATE = 100;
const ROOMS_TO_CREATE = 100;
const BOOKINGS_TO_CREATE = 100;
const USERS_TO_CREATE = 10; // Crearemos algunos usuarios de ejemplo

// --- Funciones de Creación de Datos ---

const createRandomGuests = async () => {
    const guests = [];
    for (let i = 0; i < GUESTS_TO_CREATE; i++) {
        guests.push({
            name: faker.person.fullName(),
            documentNumber: faker.string.uuid(), // Usamos UUID para asegurar unicidad
            email: faker.internet.email(),
            phone: faker.phone.number(),
            status: 'ACTIVE' // Todos los nuevos huéspedes estarán activos
        });
    }
    await Guest.bulkCreate(guests);
    console.log(`${GUESTS_TO_CREATE} huéspedes creados.`);
};

const createRandomRooms = async () => {
    const rooms = [];
    const roomTypes: ('Individual' | 'Doble' | 'Suite')[] = ['Individual', 'Doble', 'Suite'];
    for (let i = 0; i < ROOMS_TO_CREATE; i++) {
        rooms.push({
            number: `${faker.number.int({ min: 100, max: 999 })}${faker.string.alpha(1).toUpperCase()}`,
            type: faker.helpers.arrayElement(roomTypes),
            price: faker.commerce.price({ min: 100000, max: 800000, dec: 0 }),
            status: 'ACTIVE' // Todas las nuevas habitaciones estarán activas
        });
    }
    await Room.bulkCreate(rooms, { ignoreDuplicates: true }); // Evitar errores por número de habitación duplicado
    console.log(`${ROOMS_TO_CREATE} habitaciones creadas.`);
};

const createRandomServices = async () => {
    const services = [
        { name: 'Desayuno Buffet', description: 'Acceso completo a nuestro buffet de desayuno.', price: 50000, status: 'ACTIVE' },
        { name: 'Wi-Fi Premium', description: 'Conexión a internet de alta velocidad.', price: 20000, status: 'ACTIVE' },
        { name: 'Servicio de Lavandería', description: 'Lavado y planchado por kg.', price: 30000, status: 'ACTIVE' },
        { name: 'Parking', description: 'Plaza de aparcamiento vigilado.', price: 40000, status: 'ACTIVE' },
        { name: 'Acceso al Spa', description: 'Acceso completo a las instalaciones del spa.', price: 150000, status: 'ACTIVE' }
    ];
    await Service.bulkCreate(services);
    console.log(`${services.length} servicios creados.`);
};

const createSettings = async () => {
    const settings = [
        { key: 'hotel_name', value: 'Hotel Uniguajira' },
        { key: 'hotel_address', value: 'Km 5, Vía Maicao, Riohacha' },
        { key: 'default_currency', value: 'COP' },
        { key: 'tax_rate', value: '0.19' }
    ];
    await Setting.bulkCreate(settings, { ignoreDuplicates: true });
    console.log(`${settings.length} ajustes creados.`);
};

const createRandomBookingsAndInvoices = async () => {
    const guests = await Guest.findAll({ where: { status: 'ACTIVE' } });
    const rooms = await Room.findAll({ where: { status: 'ACTIVE' } });
    const bookingsData = [];

    for (let i = 0; i < BOOKINGS_TO_CREATE; i++) {
        const guest = faker.helpers.arrayElement(guests);
        const room = faker.helpers.arrayElement(rooms);
        const checkInDate = faker.date.soon({ days: 30 });
        const checkOutDate = new Date(checkInDate);
        const nights = faker.number.int({ min: 1, max: 7 });
        checkOutDate.setDate(checkOutDate.getDate() + nights);
        const totalPrice = nights * (room.price as number);

        bookingsData.push({
            checkInDate,
            checkOutDate,
            totalPrice,
            booking_status: faker.helpers.arrayElement(['Confirmada', 'Pagada', 'Pendiente']),
            status: 'ACTIVE',
            guestId: guest.id,
            roomId: room.id,
        });
    }
    const createdBookings = await Booking.bulkCreate(bookingsData);
    console.log(`${BOOKINGS_TO_CREATE} reservas creadas.`);

    // Crear facturas solo para reservas confirmadas o pagadas
    const invoicesData = [];
    for (const booking of createdBookings) {
        if (booking.booking_status === 'Confirmada' || booking.booking_status === 'Pagada') {
            invoicesData.push({
                totalAmount: booking.totalPrice,
                issueDate: new Date(),
                status: booking.booking_status === 'Pagada' ? 'Pagada' : 'Pendiente',
                bookingId: booking.id,
            });
        }
    }
    await Invoice.bulkCreate(invoicesData);
    console.log(`${invoicesData.length} facturas creadas.`);
};

const createRandomUsers = async () => {
    const users = [];
    for (let i = 0; i < USERS_TO_CREATE; i++) {
        users.push({
            // ESTA ES LA LÍNEA QUE CAMBIA
            username: faker.internet.username(), // Cambiamos userName a username
            email: faker.internet.email(),
            password: 'password123', 
            status: 'ACTIVE',
            avatar: faker.image.avatar()
        });
    }
    await User.bulkCreate(users);
    console.log(`${USERS_TO_CREATE} usuarios creados.`);
}
const populateDatabase = async () => {
    try {
        // force: true eliminará y volverá a crear las tablas. Úsalo solo en desarrollo.
        await sequelize.sync({ force: true });
        console.log("Base de datos sincronizada (tablas eliminadas y recreadas).");

        // Ejecutamos las funciones en orden
        await createRandomGuests();
        await createRandomRooms();
        await createRandomServices();
        await createSettings();
        await createRandomUsers(); // Crear usuarios antes de reservas
        await createRandomBookingsAndInvoices();

        console.log("¡La base de datos ha sido poblada con éxito!");
    } catch (error) {
        console.error("Error al poblar la base de datos:", error);
    } finally {
        await sequelize.close();
    }
};

populateDatabase();

/*
* ==================================================================
* COMANDOS PARA POBLAR LA BASE DE DATOS
* ==================================================================
*
* 1. Asegúrate de tener las dependencias de desarrollo instaladas:
* npm install
*
* 2. Asegúrate de que tu archivo .env esté configurado correctamente con
* las credenciales de tu base de datos MySQL.
*
* 3. Ejecuta el siguiente comando desde la raíz de la carpeta 'backend':
* npx ts-node src/faker/hotel_data.ts
*
* Esto borrará todas las tablas existentes y las volverá a crear con
* 100 registros de datos falsos para cada entidad principal.
*
*/