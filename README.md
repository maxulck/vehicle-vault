# Vehicle Vault

Vehicle Vault es una app full-stack para administrar un inventario de vehiculos. Esta pensada como proyecto de curriculum: tiene autenticacion con usuarios, contrasenas cifradas, JWT, modelos de MongoDB, API REST y una interfaz en React con JSX.

## Stack

- Node.js + Express
- React + Vite + JSX
- MongoDB + Mongoose
- JWT para sesiones
- bcryptjs para hash de contrasenas
- pnpm workspaces

## Requisitos

- Node.js 20+
- pnpm 9+
- MongoDB local o una base MongoDB Atlas

## Instalacion

```bash
pnpm install
cp .env.example server/.env
```

Edita `server/.env` con tu conexion real de MongoDB y un `JWT_SECRET` seguro.

Importante: `.env.example` es solo una plantilla para subir a GitLab. El archivo que usa el backend cuando ejecutas `pnpm dev` es `server/.env`.

## Desarrollo

```bash
pnpm dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/api`

## Variables de entorno

En `server/.env` debes poner la conexion de MongoDB en `MONGODB_URI`.

Ejemplo local:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/vehicle_vault
JWT_SECRET=una-clave-larga-y-segura
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_URL=http://localhost:5173
SEED_DEMO_USER=true
DEMO_USER_NAME=Usuario Demo
DEMO_USER_EMAIL=demo@vehiclevault.dev
DEMO_USER_PASSWORD=Demo1234
```

Ejemplo MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/vehicle_vault?retryWrites=true&w=majority
JWT_SECRET=una-clave-larga-y-segura
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_URL=https://tu-app.vercel.app
SEED_DEMO_USER=true
DEMO_USER_NAME=Usuario Demo
DEMO_USER_EMAIL=demo@vehiclevault.dev
DEMO_USER_PASSWORD=Demo1234
```

Usuario demo incluido:

```text
Email: demo@vehiclevault.dev
Contrasena: Demo1234
```

Si no quieres que se cree el usuario demo, cambia `SEED_DEMO_USER=false`.

En `client/.env`, solo si necesitas cambiar la URL de la API:

```env
VITE_API_URL=http://localhost:4000/api
```

## Scripts utiles

```bash
pnpm dev:server
pnpm dev:client
pnpm build
pnpm start
```

## Funcionalidades

- Registro e inicio de sesion
- Token JWT persistido en el navegador
- Rutas protegidas en API
- CRUD de vehiculos por usuario
- Busqueda y estadisticas rapidas
- Modelos separados para usuarios y vehiculos

## Deploy

El frontend esta preparado para Vercel con `vercel.json`.

Configuracion recomendada en Vercel:

- Framework preset: `Vite`
- Build command: `pnpm --filter client build`
- Output directory: `client/dist`
- Install command: `pnpm install --no-frozen-lockfile`
- Environment variable: `VITE_API_URL=https://url-de-tu-backend/api`

Para el backend Express con MongoDB, usa un servicio como Render, Railway, Fly.io o una VPS. En ese servicio configura estas variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `CLIENT_URL=https://tu-app.vercel.app`

## Estructura

```text
client/      App React con JSX
server/      API Express, modelos MongoDB y rutas
```
