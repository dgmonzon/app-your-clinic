# Clinic Connect (87)

Una aplicacion para que usuarios tomen citas  con clinicas. La aplicacion va a tener las siguientes vistas:
My Customers: Vista en donde se listaran todas las clinicas que el usuario marco como preferidas o de interes. Sobre cada item (clinica) el usuario tendra la opcion de tomar una cita, esto visulizara un nuevo listado en donde se le mostrara el schedule para esa clinica en donde figuraran todas las fechas/horas disponibles de la clinica seleccionada, asi como las fecha/horas que no estan displobiles en ese momento. Estas fechas estaran ordenadas cronologicamente en donde se detallara que doctores podrian asistir a la misma, los datos de ubicacion de la clinica y el telefono. Aqui el usuario podra elegir una de las fechas disponibles con la que se creara realmente la cita. Filtros de ubicacion por Estado, Bloque y Suburbio.

Add Customers: Vista en donde se listaran todas las clinicas del sistema en donde se hara una distincion entre las que estan marcadas como preferidas o de interes, como las que no. Ademas el usuario tendra la opcion de marcar o desmarcar si una clinica es o no de interes. Como dato de la clinica se indicara su ubicacion y telefono y detalle de los doctores que trabajan ahi. Filtros de ubicacion por Estado, Bloque y Suburbio.

My Appointments: Vista en donde se listaran las citas que fueron creadas en My Customers, con el detalle de la fecha y la clinica. Filtros de ubicacion por Estado, Bloque y Suburbio.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7ec71275-2aeb-477d-a7c0-b7f6b32277aa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
