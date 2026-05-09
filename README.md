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
- pnpm 10+
- MongoDB local o una base MongoDB Atlas

## Instalacion

```bash
pnpm install
```

Edita `server/.env` con tu conexion real de MongoDB y un `JWT_SECRET` seguro. Ese archivo es local y no se sube al repositorio.

## Desarrollo

```bash
pnpm dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/api`

## Variables de entorno locales

El unico archivo `.env` local que usa el proyecto es `server/.env`. Debe tener estas variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `CLIENT_URL`
- `SEED_DEMO_USER`
- `DEMO_USER_NAME`
- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`

Usuario demo incluido:

```text
Email: demo@vehiclevault.dev
Contrasena: Demo1234
```

Si no quieres que se cree el usuario demo, cambia `SEED_DEMO_USER=false`.

El frontend usa `http://localhost:4000/api` por defecto en desarrollo. Para Netlify, configura `VITE_API_URL` directamente en las variables de entorno del panel de Netlify.

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

## Deploy en Netlify

El frontend esta preparado para Netlify con `netlify.toml`.

Configuracion recomendada en Netlify:

- Build command: `corepack enable && corepack prepare pnpm@10.24.0 --activate && pnpm install --no-frozen-lockfile && pnpm --filter client build`
- Publish directory: `client/dist`
- Base directory: vacio o raiz del repositorio
- Environment variable: `VITE_API_URL=https://url-de-tu-backend/api`

## Deploy del backend en Render

El backend Express esta preparado para Render con `render.yaml`.

Pasos recomendados:

1. Crea un nuevo `Web Service` en Render desde el repositorio de GitHub.
2. Usa el servicio `vehicle-vault-api` detectado por `render.yaml`.
3. Agrega estas variables de entorno en Render:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `CLIENT_URL=https://tu-app.netlify.app`

Render asigna `PORT` automaticamente, asi que puedes omitirlo si Render no te lo pide.

Cuando Render entregue la URL del backend, por ejemplo:

```text
https://vehicle-vault-api.onrender.com
```

vuelve a Netlify y cambia:

```env
VITE_API_URL=https://vehicle-vault-api.onrender.com/api
```

Despues haz un nuevo deploy en Netlify.

## Estructura

```text
client/      App React con JSX
server/      API Express, modelos MongoDB y rutas
```
