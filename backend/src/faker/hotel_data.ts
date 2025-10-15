import { faker } from '@faker-js/faker';
import { sequelize } from '../database/db';

// Importar todos los modelos
import { Guest } from '../models/Guest';
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { Invoice } from '../models/Invoice';
import { Setting } from '../models/Setting';
import { User } from '../models/authorization/User';
import { Role } from '../models/authorization/Role';
import { Resource } from '../models/authorization/Resource';
import { RoleUser } from '../models/authorization/RoleUser';
import { ResourceRole } from '../models/authorization/ResourceRole';

/**
 * Función principal para poblar toda la base de datos.
 */
const populateDatabase = async () => {
    try {
        console.log('Iniciando la sincronización de la base de datos (force: true)...');
        
        // --- INICIO DE LA SOLUCIÓN ---
        // 1. Desactivar temporalmente la revisión de llaves foráneas
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
        // --- FIN DE LA SOLUCIÓN ---

        // force: true eliminará y volverá a crear todas las tablas.
        await sequelize.sync({ force: true });
        console.log("Base de datos sincronizada (tablas eliminadas y recreadas).");
        
        // --- INICIO DE LA SOLUCIÓN ---
        // 2. Reactivar la revisión de llaves foráneas
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
        // --- FIN DE LA SOLUCIÓN ---

        // --- POBLAR DATOS DE AUTORIZACIÓN ---
        console.log('Poblando datos de autorización...');
        await populateAuthData();

        // --- POBLAR DATOS DEL NEGOCIO (HOTEL) ---
        console.log('Poblando datos del hotel...');
        await populateHotelData();

        console.log("¡La base de datos ha sido poblada con éxito!");

    } catch (error) {
        console.error("Error al poblar la base de datos:", error);
    } finally {
        await sequelize.close();
        console.log('Conexión a la base de datos cerrada.');
    }
};

/**
 * Pobla todas las tablas relacionadas con la autorización:
 * Users, Roles, Resources, y sus relaciones.
 */
const populateAuthData = async () => {
    // 1. Crear Roles
    // ¡CAMBIO AQUÍ! Usar "name" en lugar de "role_name"
    const [adminRole, receptionistRole, guestRole] = await Role.bulkCreate([
        { name: 'ADMIN', is_active: 'ACTIVE' },
        { name: 'RECEPCIONISTA', is_active: 'ACTIVE' },
        { name: 'HUESPED_REGISTRADO', is_active: 'ACTIVE' },
    ]);
    console.log('Roles creados.');

    // 2. Crear Usuarios de prueba
    const [adminUser, receptionistUser, regularUser] = await User.bulkCreate([
        { username: 'admin', email: 'admin@hotel.com', password: 'password123', is_active: 'ACTIVE' },
        { username: 'recepcionista', email: 'recepcionista@hotel.com', password: 'password123', is_active: 'ACTIVE' },
        { username: 'huesped', email: 'huesped@correo.com', password: 'password123', is_active: 'ACTIVE' },
    ]);
    console.log('Usuarios creados.');

    // 3. Asignar Roles a Usuarios (RoleUser)
    await RoleUser.bulkCreate([
        { UserId: adminUser.id, RoleId: adminRole.id, is_active: 'ACTIVE' },
        { UserId: receptionistUser.id, RoleId: receptionistRole.id, is_active: 'ACTIVE' },
        { UserId: regularUser.id, RoleId: guestRole.id, is_active: 'ACTIVE' },
    ]);
    console.log('Relaciones Role-User creadas.');

    // 4. Crear Recursos (todas las rutas protegidas de tu API)
    const resourcesList = [
        // Rutas de Guests
        { path: '/api/guests', method: 'GET' }, { path: '/api/guests', method: 'POST' },
        { path: '/api/guests/:id', method: 'GET' }, { path: '/api/guests/:id', method: 'PATCH' }, { path: '/api/guests/:id/logic', method: 'DELETE' },
        // Rutas de Rooms
        { path: '/api/rooms', method: 'GET' }, { path: '/api/rooms', method: 'POST' },
        { path: '/api/rooms/:id', method: 'GET' }, { path: '/api/rooms/:id', method: 'PATCH' }, { path: '/api/rooms/:id/logic', method: 'DELETE' },
        // Rutas de Bookings
        { path: '/api/bookings', method: 'GET' }, { path: '/api/bookings', method: 'POST' },
        { path: '/api/bookings/:id', method: 'GET' }, { path: '/api/bookings/:id', method: 'PATCH' }, { path: '/api/bookings/:id/logic', method: 'DELETE' },
        // ... puedes añadir el resto de rutas (services, invoices, etc.)
    ];
    const resources = await Resource.bulkCreate(resourcesList.map(r => ({ ...r, is_active: 'ACTIVE' })));
    console.log('Recursos (rutas) creados.');

    // 5. Asignar Permisos a Roles (ResourceRole)
    const resourceRoles = [];

    // El rol ADMIN tiene acceso a TODOS los recursos
    for (const resource of resources) {
        resourceRoles.push({ ResourceId: resource.id, RoleId: adminRole.id, is_active: 'ACTIVE' });
    }

    // El rol RECEPCIONISTA tiene acceso a casi todo, excepto borrar (ejemplo)
    const receptionistPermissions = resources.filter(r => !r.path.includes('delete'));
    for (const resource of receptionistPermissions) {
        resourceRoles.push({ ResourceId: resource.id, RoleId: receptionistRole.id, is_active: 'ACTIVE' });
    }

    await ResourceRole.bulkCreate(resourceRoles);
    console.log('Relaciones Resource-Role creadas.');
};


/**
 * Pobla las tablas del negocio del hotel: Settings, Guests, Rooms, etc.
 */
const populateHotelData = async () => {
    // Crear Settings
    await Setting.bulkCreate([
        { key: 'hotel_name', value: 'Hotel Uniguajira' },
        { key: 'hotel_address', value: 'Km 5, Vía Maicao, Riohacha' },
    ], { ignoreDuplicates: true });
    console.log('Settings creados.');

    // Crear Guests (Huéspedes)
    const guestsData = [];
    for (let i = 0; i < 50; i++) {
        guestsData.push({
            name: faker.person.fullName(),
            documentNumber: faker.string.uuid(),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            status: 'ACTIVE'
        });
    }
    await Guest.bulkCreate(guestsData);
    console.log('Huéspedes creados.');

    // Crear Rooms (Habitaciones)
    const roomsData = [];
    const roomTypes: ('Individual' | 'Doble' | 'Suite')[] = ['Individual', 'Doble', 'Suite'];
    for (let i = 0; i < 20; i++) {
        roomsData.push({
            number: `${i + 101}`, // Números de habitación únicos
            type: faker.helpers.arrayElement(roomTypes),
            price: faker.commerce.price({ min: 150000, max: 700000, dec: 0 }),
            status: 'ACTIVE'
        });
    }
    await Room.bulkCreate(roomsData);
    console.log('Habitaciones creadas.');

     // Crear Servicios
     await Service.bulkCreate([
        { name: 'Desayuno', description: 'Desayuno tipo buffet.', price: 35000, status: 'ACTIVE' },
        { name: 'Lavandería', description: 'Servicio de lavado y planchado.', price: 50000, status: 'ACTIVE' },
        { name: 'Transporte Aeropuerto', description: 'Transporte desde y hacia el aeropuerto.', price: 80000, status: 'ACTIVE' }
    ]);
    console.log('Servicios creados.');
    
    // Crear Bookings (Reservas) y sus Invoices (Facturas)
    const guests = await Guest.findAll();
    const rooms = await Room.findAll();
    const bookingsData = [];
    for (let i = 0; i < 100; i++) {
        const guest = faker.helpers.arrayElement(guests);
        const room = faker.helpers.arrayElement(rooms);
        const checkInDate = faker.date.soon({ days: 30 });
        const nights = faker.number.int({ min: 1, max: 5 });
        const checkOutDate = new Date(checkInDate.getTime() + nights * 24 * 60 * 60 * 1000);
        const totalPrice = nights * (room.price as number);

        bookingsData.push({
            guestId: guest.id,
            roomId: room.id,
            checkInDate,
            checkOutDate,
            totalPrice,
            booking_status: faker.helpers.arrayElement(['Confirmada', 'Pagada', 'Pendiente']),
            status: 'ACTIVE'
        });
    }
    const createdBookings = await Booking.bulkCreate(bookingsData);
    console.log('Reservas creadas.');
    
    const invoicesData = [];
    for (const booking of createdBookings) {
        if (booking.booking_status === 'Pagada' || booking.booking_status === 'Confirmada') {
            invoicesData.push({
                totalAmount: booking.totalPrice,
                issueDate: new Date(),
                status: booking.booking_status === 'Pagada' ? 'Pagada' : 'Pendiente',
                bookingId: booking.id,
            });
        }
    }
    await Invoice.bulkCreate(invoicesData);
    console.log('Facturas creadas.');
};


// Ejecutar la función principal
populateDatabase();

/*
* ==================================================================
* COMANDOS PARA POBLAR LA BASE DE DATOS
* ==================================================================
*
* 1. Abre tu terminal en la carpeta 'backend' de tu proyecto.
*
* 2. Ejecuta el siguiente comando. Esto borrará toda tu base de datos
* y la llenará con datos de prueba, incluyendo usuarios, roles y permisos.
*
* npx ts-node src/faker/hotel_data.ts
*
* ==================================================================
* USUARIOS DE PRUEBA CREADOS (contraseña: "password123")
* ==================================================================
* - admin@hotel.com (Rol: ADMIN, tiene todos los permisos)
* - recepcionista@hotel.com (Rol: RECEPCIONISTA, permisos limitados)
* - huesped@correo.com (Rol: HUESPED_REGISTRADO, sin permisos por ahora)
* ==================================================================
*/