# 📘 MANUAL DE SISTEMA - HOTEL Y RESERVAS

## 1. Información del Proyecto

**Nombre del Proyecto:** Sistema de Gestión Hotelera - Hotel y Reservas

**Nombre del Estudiante:** y0ner

**Curso:** Desarrollo de Aplicaciones Web

**Semestre:** 2024-2

**Fecha:** Noviembre 18, 2025

**Instructor:** [Nombre del Instructor]

### Descripción Breve del Proyecto:

Sistema integral web para la gestión hotelera que permite administrar reservas, huéspedes, habitaciones, servicios, pagos y reportes. Proporciona una plataforma centralizada para mejorar la experiencia de gestión administrativa y operativa de hoteles.

---

## 2. Descripción General de la Arquitectura del Sistema

### 2.1 Descripción de la Arquitectura

El sistema utiliza una arquitectura de tres capas:

- **Capa de Presentación (Frontend):** Angular 20 con componentes interactivos e interfaces responsivas.
- **Capa de Lógica de Negocio (Backend):** Node.js con Express.js, controladores y servicios REST.
- **Capa de Datos:** Sequelize ORM con soporte multi-base de datos (MySQL, PostgreSQL, Oracle, MSSQL).

### 2.2 Tecnologías Utilizadas

- **Frontend:** Angular 20, PrimeNG, TailwindCSS, RxJS, TypeScript
- **Backend:** Node.js, Express.js 5.1, TypeScript, Sequelize 6.37.7
- **Motor de Base de Datos:** MySQL, PostgreSQL, Oracle, SQL Server
- **Librerías/Herramientas Adicionales:** 
  - JWT (Autenticación)
  - BCrypt (Encriptación)
  - Faker.js (Datos de prueba)
  - CORS, Morgan (Logging)

### 2.3 Explicación Visual de la Operación del Sistema

```
┌──────────────────────┐
│   CLIENTE NAVEGADOR  │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│   FRONTEND ANGULAR   │
│ ├─ Componentes       │
│ ├─ Servicios HTTP    │
│ └─ Guards Auth       │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│   BACKEND EXPRESS    │
│ ├─ Controladores     │
│ ├─ Validaciones      │
│ └─ Middleware Auth   │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│   BASE DE DATOS      │
│ ├─ Clientes          │
│ ├─ Habitaciones      │
│ ├─ Reservas          │
│ └─ Servicios         │
└──────────────────────┘
```

---

## 3. Documentación de la Base de Datos

### 3.1 Descripción de la Base de Datos

Base de datos relacional que gestiona toda la información operativa del hotel. Soporta múltiples motores mediante Sequelize ORM. Contiene 13 entidades principales organizadas en:
- Gestión hotelera (Hotel, Habitaciones, Tipos)
- Gestión de huéspedes (Clientes, Reservas, Check-in/out)
- Gestión de servicios (Servicios, Tarifas, Temporadas, Pagos)

### 3.2 Diagrama de Relaciones de Entidades (ERD)

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   CLIENTE   │◄────────┤  RESERVACIÓN │────────►│   HABITACIÓN │
│  (id, nombre)        │  (id, fechas)│         │  (id, número)│
└─────────────┘         └──────────────┘         └──────────────┘
                               │                        │
                               │                        │
                        ┌──────▼───────┐         ┌──────▼──────────┐
                        │    PAGO      │         │  TIPO HABITACIÓN│
                        └──────────────┘         └──────┬──────────┘
                               │                        │
                        ┌──────▼──────────┐       ┌──────▼────────┐
                        │   CHECKIN/OUT   │       │  TARIFA/TASA  │
                        └──────────────────┘       └──────┬────────┘
                                                   │
                                        ┌──────────▼─────────┐
                                        │   TEMPORADA        │
                                        └────────────────────┘
```

### 3.3 Modelo Lógico

**Entidades principales:**
- **Hotel:** información general (nombre, dirección, ciudad, teléfono)
- **Cliente:** datos del huésped (nombre, documento, email, nacionalidad)
- **Habitación:** datos de cuartos (número, piso, capacidad, precio)
- **Tipo Habitación:** categorías (nombre, descripción, máximo personas)
- **Reservación:** registro de reservas (fechas, monto, estado)
- **Tarifa:** precios por tipo y temporada
- **Temporada:** períodos especiales con multiplicador
- **Servicio:** servicios adicionales (nombre, precio, categoría)
- **Pago:** registro de pagos (monto, método, fecha)

### 3.4 Modelo Físico (Tablas)

| Tabla | Columna | Tipo | PK/FK | Descripción |
|-------|---------|------|-------|-------------|
| **clients** | id | INT | PK | Identificador único |
| | first_name | VARCHAR(255) | | Nombre |
| | last_name | VARCHAR(255) | | Apellido |
| | document | VARCHAR(50) | | Documento |
| | email | VARCHAR(255) | | Correo |
| | phone | VARCHAR(20) | | Teléfono |
| | nationality | VARCHAR(100) | | Nacionalidad |
| | status | ENUM('ACTIVE','INACTIVE') | | Estado |
| **hotels** | id | INT | PK | Identificador único |
| | name | VARCHAR(255) | | Nombre |
| | address | VARCHAR(255) | | Dirección |
| | city | VARCHAR(100) | | Ciudad |
| | country | VARCHAR(100) | | País |
| | phone | VARCHAR(20) | | Teléfono |
| | stars | INT | | Estrellas (1-5) |
| | status | ENUM('ACTIVE','INACTIVE') | | Estado |
| **rooms** | id | INT | PK | Identificador único |
| | number | INT | | Número de cuarto |
| | floor | INT | | Piso |
| | capacity | INT | | Capacidad |
| | base_price | FLOAT | | Precio base |
| | available | BOOLEAN | | Disponible |
| | hotel_id | INT | FK | Referencia a hotels |
| | roomtype_id | INT | FK | Referencia a roomtypes |
| | status | ENUM('ACTIVE','INACTIVE') | | Estado |
| **reservations** | id | INT | PK | Identificador único |
| | start_date | DATE | | Fecha entrada |
| | end_date | DATE | | Fecha salida |
| | number_of_guests | INT | | Número huéspedes |
| | total_amount | FLOAT | | Monto total |
| | client_id | INT | FK | Referencia a clients |
| | room_id | INT | FK | Referencia a rooms |
| | status | ENUM('ACTIVE','INACTIVE') | | Estado |
| **payments** | id | INT | PK | Identificador único |
| | amount | FLOAT | | Monto |
| | method | VARCHAR(50) | | Método |
| | payment_date | DATE | | Fecha pago |
| | reservation_id | INT | FK | Referencia a reservations |
| | status | ENUM('ACTIVE','CANCELLED') | | Estado |

---

## 4. Casos de Uso - CRUD

### 4.1 Caso de Uso: Crear Cliente

- **Actor:** Administrador
- **Descripción:** Registrar nuevo huésped
- **Precondiciones:** Usuario autenticado
- **Postcondiciones:** Cliente creado y disponible
- **Flujo Principal:**
  1. Acceder módulo Clientes
  2. Clic en "Crear Cliente"
  3. Completar formulario
  4. Enviar datos
  5. Sistema valida y crea registro

### 4.2 Caso de Uso: Leer Cliente

- **Actor:** Administrador
- **Descripción:** Consultar información de clientes
- **Precondiciones:** Clientes en sistema
- **Postcondiciones:** Datos mostrados
- **Flujo Principal:**
  1. Acceder módulo Clientes
  2. Sistema lista clientes
  3. Seleccionar cliente
  4. Ver detalles

### 4.3 Caso de Uso: Actualizar Cliente

- **Actor:** Administrador
- **Descripción:** Modificar datos existentes
- **Precondiciones:** Cliente debe existir
- **Postcondiciones:** Datos actualizados
- **Flujo Principal:**
  1. Seleccionar cliente
  2. Clic "Editar"
  3. Modificar campos
  4. Guardar cambios

### 4.4 Caso de Uso: Eliminar Cliente

- **Actor:** Administrador
- **Descripción:** Inactivar cliente (eliminación lógica)
- **Precondiciones:** Sin reservas activas
- **Postcondiciones:** Cliente inactivo
- **Flujo Principal:**
  1. Seleccionar cliente
  2. Clic "Eliminar"
  3. Confirmar acción
  4. Estado = INACTIVE

---

## 5. Documentación del Backend

### 5.1 Arquitectura del Backend

Express.js con patrón MVC:
- **Models:** Entidades con Sequelize
- **Controllers:** Lógica de negocio
- **Routes:** Endpoints REST
- **Middleware:** Autenticación JWT
- **Database:** Conexión Sequelize

### 5.2 Estructura de Carpetas

```
backend-Hotel/src/
├── server.ts              # Entrada principal
├── config/
│   └── index.ts           # Config Express
├── database/
│   └── db.ts              # Config Sequelize
├── middleware/
│   └── auth.ts            # JWT Auth
├── models/
│   ├── associations.ts    # Relaciones
│   ├── Hotel.ts
│   ├── Client.ts
│   ├── Room.ts
│   ├── Reservation.ts
│   └── ...
├── controllers/
│   ├── Hotel.Controller.ts
│   ├── Client.Controller.ts
│   └── ...
├── routes/
│   ├── index.ts
│   ├── Client.Routes.ts
│   └── ...
└── faker/
    └── populate.ts        # Datos de prueba
```

### 5.3 API Documentation (REST)

**POST `/api/Clients`** - Crear cliente
- **Propósito:** Registrar nuevo huésped
- **Request Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "document": "12345678",
  "phone": "3001234567",
  "email": "juan@example.com",
  "nationality": "Colombiana",
  "status": "ACTIVE"
}
```
- **Response:** 201 Created

**GET `/api/Clients`** - Obtener clientes
- **Propósito:** Listar todos los clientes
- **Response:** 200 OK

**GET `/api/Clients/:id`** - Obtener cliente
- **Propósito:** Obtener cliente por ID
- **Response:** 200 OK | 404 Not Found

**PATCH `/api/Clients/:id`** - Actualizar cliente
- **Propósito:** Modificar datos cliente
- **Response:** 200 OK | 404 Not Found

**DELETE `/api/Clients/:id/logic`** - Eliminar cliente
- **Propósito:** Marcar como inactivo
- **Response:** 200 OK | 404 Not Found

**Similar para:** Reservations, Payments, Hotels, Rooms

### 5.4 Cliente REST

Archivos `.http` disponibles en `src/http/` para pruebas:
- `client.http`
- `reservation.http`
- `payment.http`
- `hotel.http`
- `room.http`

---

## 6. Documentación del Frontend

### 6.1 Documentación Técnica del Frontend

**Framework:** Angular 20 (TypeScript)

**Estructura:**

```
frontend-Hotel/src/app/
├── app.config.ts          # Config Angular
├── app.routes.ts          # Rutas principales
├── app.ts                 # Componente raíz
├── guards/
│   └── authguard.ts       # Protección rutas
├── models/
│   ├── Client.ts
│   ├── Reservation.ts
│   └── ...
├── services/
│   ├── auth.service.ts    # Autenticación
│   ├── Client.service.ts
│   └── ...
└── components/
    ├── auth/ (login, register)
    ├── Cliente/ (CRUD)
    ├── Habitacion/ (CRUD)
    ├── Reserva/ (CRUD)
    └── layout/ (header, aside, footer)
```

**Características:**
- Componentes reactivos
- Servicios HTTP
- Guards de autenticación
- PrimeNG para UI
- TailwindCSS para estilos

### 6.2 Explicación Visual del Funcionamiento

```
Usuario Inicia │
               ▼
        ┌──────────────┐
        │  Login Page  │
        └──────┬───────┘
               │ Autentica
               ▼
        ┌──────────────┐
        │  Dashboard   │
        └──────┬───────┘
               │
    ┌──────────┼──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
  [Clientes] [Reservas] [Pagos] [Habitaciones]
```

---

## 7. Integración Frontend-Backend

**Comunicación:** HTTP REST
- Solicitudes HTTP desde Frontend a Backend
- Responses en JSON
- Autenticación JWT (token en localStorage)
- CORS habilitado
- Manejo de errores en ambas capas

**Flujo de Autenticación:**
1. Usuario ingresa credenciales
2. POST a `/api/auth/login`
3. Backend retorna JWT
4. Frontend almacena token
5. Rutas protegidas verifican token

---

## 8. Conclusiones y Recomendaciones

**Conclusiones:**
- Sistema modular y escalable
- Arquitectura de tres capas bien definida
- Soporte multi-base de datos
- Seguridad con JWT y BCrypt
- Frontend reactivo con Angular
- Base de datos bien estructurada

**Recomendaciones:**
- Agregar más validaciones en frontend
- Implementar caché para consultas
- Realizar pruebas unitarias
- Documentar API con Swagger
- Optimizar consultas BD
- Implementar auditorías
- Agregar más logs en producción

---

## 9. Anexos

**Tecnologías:**
- Angular 20.2.0
- Node.js 18+
- Express 5.1.0
- Sequelize 6.37.7
- TypeScript 5.9.3
- MySQL/PostgreSQL/Oracle/MSSQL

**Repositorio GitHub:**
[github.com/y0ner/hotel-and-reservations](https://github.com/y0ner/hotel-and-reservations)

**Instalación:**
```bash
# Backend
cd backend-Hotel
npm install
npm run dev

# Frontend
cd frontend-Hotel
npm install
npm start
```

---

**Documento generado:** 18 de Noviembre, 2025
