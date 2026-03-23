<div align="center">

![Hotel Banner](https://capsule-render.vercel.app/api?type=waving&color=1e293b&height=250&section=header&text=Hotel%20Reserves&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Sistema%20integral%20de%20gesti%C3%B3n%20y%20reservas%20hoteleras.&descAlignY=55&descSize=20)

[![Estado del Proyecto](https://img.shields.io/badge/Estado-Activo-success?style=for-the-badge)](https://github.com/y0ner/hotel-and-reservations)
[![Mantenimiento](https://img.shields.io/badge/Mantenimiento-Continuo-blue?style=for-the-badge)](https://github.com/y0ner/hotel-and-reservations)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)](https://github.com/y0ner/hotel-and-reservations)

</div>

Una solución unificada, técnica y escalable diseñada para administrar habitaciones, roles de usuario, flujo de reservas en línea y métricas organizacionales dentro de una infraestructura hotelera empresarial.

---

## Arquitectura del Proyecto

El repositorio maneja un desacoplamiento lógico dividiendo estrictamente su base en sistemas diferenciados como Backend y Frontend, acompañado de extensa documentación y trazabilidad de implementaciones funcionales:

### 1. Componentes de Software Principales
- [**backend-Hotel**](./backend-Hotel) - Lógica y reglas del negocio central, scripts de manejo y persistencia de bases de datos, APIs REST y control cifrado de accesos de sesión.
- [**frontend-Hotel**](./frontend-Hotel) - Experiencia visual intuitiva separada tanto para clientes que realizan peticiones de habitaciones online, como el área administrativa integral (dashboard y gestión de recepción).

### 2. Documentación y Recursos Técnicos Extensos
- [**Manual de Sistemas.md**](./Manual%20de%20Sistemas.md) - Guía profunda orientada a administradores IT referida a la implantación en el servidor y reglas del software.
- [**Manual del usuario.md**](./Manual%20del%20usuario.md) - Manual estándar operativo de inducción para operarios de mostrador del hotel.
- **Registro de Trazabilidad (`PASO_*`)** - Sub-documentos que reportan sistemáticamente las fases de desarrollo tecnológico e implementación (`PASO_1_SUMMARY`, `PASO_5_RESERVA_PAGADA`, etc).

---

## Guía de Inicio Rápido

Para instanciar e inicializar este proyecto web de escalada localmente, procesa con seguridad los siguientes comandos de inducción:

1. **Clonación general del código fuente:**
   ```bash
   git clone https://github.com/y0ner/hotel-and-reservations.git
   ```

2. **Levantamiento de microservicios e interfaces:**
   Navega a los sub-directorios específicos e instala las rutinas respectivas de cada capa.
   ```bash
   cd hotel-and-reservations/backend-Hotel
   npm install && npm start
   ```

*(Consulte formalmente los archivos Markdown incorporados en los directorios individuales para información precisa de variables de entorno)*.

---

<div align="center">
  <i>Desarrollado y mantenido con estándares de calidad técnica por <a href="https://github.com/y0ner">y0ner</a></i>
</div>
