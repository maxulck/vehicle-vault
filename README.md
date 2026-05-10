# Vehicle Vault

Vehicle Vault es una aplicacion full-stack para administrar un inventario privado de vehiculos. Permite crear una cuenta, iniciar sesion y gestionar vehiculos asociados a cada usuario mediante una API REST protegida con JWT.

El proyecto esta pensado como una app de portafolio: combina frontend en React, backend en Node.js/Express, persistencia en MongoDB, autenticacion segura y configuracion lista para desplegar frontend y backend por separado.

## Que hace

- Registro e inicio de sesion de usuarios.
- Contrasenas cifradas con bcrypt.
- Sesiones mediante JSON Web Tokens.
- Rutas privadas para usuarios autenticados.
- CRUD de vehiculos: crear, listar, editar y eliminar.
- Filtros por busqueda y estado del vehiculo.
- Estadisticas rapidas del inventario.
- Datos separados por usuario, para que cada cuenta vea solo sus propios vehiculos.

## Tecnologias

- React 19 + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticacion
- bcryptjs para cifrado de contrasenas
- pnpm workspaces
- Netlify para frontend
- Render para backend

## Estructura del proyecto

```text
vehicle-vault/
  client/                 Frontend React
    src/
      App.jsx             Interfaz principal
      api.js              Cliente HTTP para consumir la API
      styles.css          Estilos de la aplicacion

  server/                 Backend Express
    src/
      app.js              Configuracion de Express, CORS y rutas
      server.js           Inicio del servidor
      config/             Entorno, conexion MongoDB y usuario demo
      controllers/        Logica de autenticacion y vehiculos
      middleware/         Middleware de autenticacion JWT
      models/             Modelos User y Vehicle
      routes/             Rutas REST
```

## Requisitos

- Node.js 20 o superior
- pnpm 10 o superior
- MongoDB local o una base de datos en MongoDB Atlas

## Instalacion

Instala las dependencias desde la raiz del proyecto:

```bash
pnpm install
```

Crea o edita el archivo local `server/.env` con tus variables de entorno. Este archivo no debe subirse al repositorio porque contiene datos sensibles.

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/vehicle-vault
JWT_SECRET=un_secreto_largo_y_seguro
JWT_EXPIRES_IN=7d
PORT=4000
CLIENT_URL=http://localhost:5173

SEED_DEMO_USER=true
DEMO_USER_NAME=Demo User
DEMO_USER_EMAIL=demo@vehiclevault.dev
DEMO_USER_PASSWORD=Demo1234
```

## Ejecutar en desarrollo

Levanta frontend y backend al mismo tiempo:

```bash
pnpm dev
```

URLs locales:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/api`
- Health check: `http://localhost:4000/api/health`

Tambien puedes ejecutar cada parte por separado:

```bash
pnpm dev:client
pnpm dev:server
```

## Scripts disponibles

```bash
pnpm dev          # Ejecuta cliente y servidor en paralelo
pnpm dev:client   # Ejecuta solo el frontend
pnpm dev:server   # Ejecuta solo el backend
pnpm build        # Genera el build del frontend
pnpm start        # Inicia el backend en modo produccion
```

## Como funciona

1. El usuario se registra o inicia sesion desde el frontend.
2. El backend valida las credenciales y responde con un token JWT.
3. El frontend guarda el token en `localStorage`.
4. Cada peticion privada envia el token en el header `Authorization`.
5. El backend verifica el token y asocia la operacion al usuario autenticado.
6. Los vehiculos se guardan en MongoDB con una referencia al usuario propietario.

## Endpoints principales

### Autenticacion

```text
POST /api/auth/register   Crea una cuenta
POST /api/auth/login      Inicia sesion
GET  /api/auth/me         Devuelve el usuario autenticado
```

### Vehiculos

Todas estas rutas requieren token JWT.

```text
GET    /api/vehicles          Lista vehiculos del usuario
POST   /api/vehicles          Crea un vehiculo
PUT    /api/vehicles/:id      Actualiza un vehiculo
DELETE /api/vehicles/:id      Elimina un vehiculo
```

La lista acepta filtros por query string:

```text
GET /api/vehicles?search=toyota&status=available
```

## Modelo de vehiculo

Cada vehiculo puede guardar:

- Marca
- Modelo
- Anio
- Patente
- Categoria: `car`, `motorcycle`, `truck`, `van`, `other`
- Estado: `available`, `maintenance`, `sold`, `reserved`
- Kilometraje
- Fecha de adquisicion
- Notas

La patente es unica por usuario.

## Build

Para generar el build del frontend:

```bash
pnpm build
```

El resultado queda en:

```text
client/dist
```

## Deploy del frontend en Netlify

El proyecto incluye `netlify.toml`.

Configuracion recomendada:

- Build command: `corepack enable && corepack prepare pnpm@10.24.0 --activate && pnpm install --no-frozen-lockfile && pnpm --filter client build`
- Publish directory: `client/dist`
- Base directory: raiz del repositorio
- Variable de entorno: `VITE_API_URL=https://url-de-tu-backend/api`

## Deploy del backend en Render

El proyecto incluye `render.yaml` para desplegar la API en Render.

Variables recomendadas en Render:

```env
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=un_secreto_largo_y_seguro
JWT_EXPIRES_IN=7d
CLIENT_URL=https://tu-app.netlify.app
SEED_DEMO_USER=false
```

Render asigna el `PORT` automaticamente, asi que normalmente no hace falta configurarlo.

Cuando tengas la URL del backend, configura en Netlify:

```env
VITE_API_URL=https://tu-backend.onrender.com/api
```

Luego ejecuta un nuevo deploy del frontend.

## Usuario demo

Si `SEED_DEMO_USER=true`, el backend puede crear un usuario demo con las variables:

```text
DEMO_USER_NAME
DEMO_USER_EMAIL
DEMO_USER_PASSWORD
```

Por defecto se puede usar:

```text
Email: demo@vehiclevault.dev
Password: Demo1234
```

Para produccion se recomienda dejar `SEED_DEMO_USER=false`.

## Seguridad

- No subir `server/.env` al repositorio.
- Usar un `JWT_SECRET` largo y dificil de adivinar.
- Configurar `CLIENT_URL` con el dominio real del frontend.
- Usar MongoDB Atlas o una instancia protegida con credenciales seguras.

## Estado del proyecto

La app ya cuenta con las piezas principales de un CRUD full-stack: interfaz, API REST, autenticacion, persistencia y configuracion de despliegue.
