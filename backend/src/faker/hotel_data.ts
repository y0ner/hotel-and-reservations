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

const GUESTS_TO_CREATE = 100;
const ROOMS_TO_CREATE = 100;
const BOOKINGS_TO_CREATE = 100;
const INVOICES_TO_CREATE = 100;

// --- Funciones de Creación de Datos ---

const createRandomGuests = async () => {
    const guests = [];
    for (let i = 0; i < GUESTS_TO_CREATE; i++) {
        guests.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number()
        });
    }
    await Guest.bulkCreate(guests);
    console.log(`${GUESTS_TO_CREATE} huéspedes creados.`);
};

const createRandomRooms = async () => {
    const rooms = [];
    const roomTypes = ['Individual', 'Doble', 'Suite', 'Deluxe'];
    for (let i = 0; i < ROOMS_TO_CREATE; i++) {
        rooms.push({
            roomNumber: `${faker.number.int({ min: 1, max: 40 })}${faker.string.alpha(1).toUpperCase()}`,
            type: faker.helpers.arrayElement(roomTypes),
            price: faker.commerce.price({ min: 50, max: 300 }),
            status: 'Disponible'
        });
    }
    await Room.bulkCreate(rooms);
    console.log(`${ROOMS_TO_CREATE} habitaciones creadas.`);
};

const createRandomServices = async () => {
    const services = [
        { name: 'Desayuno Buffet', description: 'Acceso completo a nuestro buffet de desayuno.', price: 15.00 },
        { name: 'Wi-Fi Premium', description: 'Conexión a internet de alta velocidad.', price: 5.00 },
        { name: 'Servicio de Lavandería', description: 'Lavado y planchado por kg.', price: 10.00 },
        { name: 'Parking', description: 'Plaza de aparcamiento vigilado.', price: 20.00 },
        { name: 'Acceso al Spa', description: 'Acceso completo a las instalaciones del spa.', price: 35.00 }
    ];
    await Service.bulkCreate(services);
    console.log(`${services.length} servicios creados.`);
};

const createSettings = async () => {
    const settings = [
        { key: 'hotel_name', value: 'Hotel Gemini' },
        { key: 'hotel_address', value: '123 Fake Street, City' },
        { key: 'default_currency', value: 'USD' },
        { key: 'tax_rate', value: '0.15' }
    ];
    // Usamos 'ignoreDuplicates' por si el script se corre más de una vez
    await Setting.bulkCreate(settings, { ignoreDuplicates: true });
    console.log(`${settings.length} ajustes creados.`);
};

const createRandomBookings = async () => {
    const guests = await Guest.findAll(); // Ahora guest es de tipo Guest[]
    const rooms = await Room.findAll();     // Ahora room es de tipo Room[]
    const bookings = [];

    for (let i = 0; i < BOOKINGS_TO_CREATE; i++) {
        const guest = faker.helpers.arrayElement(guests);
        const room = faker.helpers.arrayElement(rooms);
        const checkInDate = faker.date.soon({ days: 30 });
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + faker.number.int({ min: 1, max: 7 }));

        bookings.push({
            checkInDate,
            checkOutDate,
            status: faker.helpers.arrayElement(['Confirmada', 'Check-in', 'Check-out']),
            guestId: guest.id, // ¡Ahora funciona!
            roomId: room.id,     // ¡Ahora funciona!
        });
    }
    await Booking.bulkCreate(bookings);
    console.log(`${BOOKINGS_TO_CREATE} reservas creadas.`);
};

const createRandomInvoices = async () => {
    const bookings = await Booking.findAll(); // Ahora booking es de tipo Booking[]
    const invoices = [];

    for (const booking of bookings) {
        invoices.push({
            totalAmount: faker.commerce.price({ min: 100, max: 2000 }),
            issueDate: new Date(),
            status: faker.helpers.arrayElement(['Pagada', 'Pendiente']),
            bookingId: booking.id, // ¡Ahora funciona!
        });
    }
    await Invoice.bulkCreate(invoices);
    console.log(`${invoices.length} facturas creadas.`);
};

const populateDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Base de datos sincronizada.");
        await createRandomGuests();
        await createRandomRooms();
        await createRandomServices();
        await createSettings();
        await createRandomBookings();
        await createRandomInvoices();
        console.log("¡La base de datos ha sido poblada con éxito!");
    } catch (error) {
        console.error("Error al poblar la base de datos:", error);
    } finally {
        await sequelize.close();
    }
};

populateDatabase();