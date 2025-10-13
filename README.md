# 🍽️ Menu Ginebro - Frontend

> **Aplicación web Angular para la gestión de menús escolares**

Una aplicación moderna desarrollada con Angular 19 que permite a estudiantes, cocineros y administradores gestionar menús escolares de manera eficiente. La aplicación incluye funcionalidades de autenticación, selección de menús, historial de pedidos y administración completa de los usuarios.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación](#-instalación)
- [Desarrollo](#-desarrollo)
- [Construcción](#-construcción)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Servicios](#-servicios)
- [Guards y Seguridad](#-guards-y-seguridad)
- [Contribución](#-contribución)
- [Soporte](#-soporte)
- [Licencia](#-licencia)

## ✨ Características

### 🔐 Autenticación y Autorización
- **Login/Logout** con tokens JWT
- **Registro de estudiantes** con verificación por código
- **Recuperación de contraseña** por email
- **Verificación de email** con códigos OTP
- **Guards de seguridad** para rutas protegidas
- **Gestión de sesiones** múltiples

### 👥 Gestión de Usuarios
- **Perfiles diferenciados**: Administrador, Cocineros, Estudiantes
- **Gestión de usuarios** completa (CRUD)
- **Importación/Exportación** masiva de usuarios
- **Activación/Desactivación** de cuentas

### 🍽️ Gestión de Menús
- **Visualización de menús** semanales
- **Selección de platos** por día
- **Gestión de tipos de platos**
- **Importación/Exportación** de menús

### 📊 Pedidos y Administración
- **Dashboard administrativo** con métricas
- **Historial de pedidos** por usuario y fecha
- **Gestión de estados** de pedidos
- **Exportación de datos** en Excel

### 🎨 Interfaz de Usuario
- **Diseño responsive** con Angular Material
- **Tema personalizable** con SCSS
- **Componentes reutilizables**
- **Alertas y notificaciones** en tiempo real
- **Calendario semanal** interactivo

## 🛠️ Tecnologías

### Core Framework
- **Angular 19** - Framework principal
- **TypeScript 5.6** - Lenguaje de programación
- **RxJS 7.8** - Programación reactiva

### UI/UX
- **Angular Material 19** - Componentes UI
- **Angular CDK 19** - Componentes de desarrollo
- **TailwindCSS 4.1** - Framework CSS utilitario
- **SCSS** - Preprocesador CSS

### HTTP y Estado
- **Axios 1.8** - Cliente HTTP
- **Angular Service Worker** - PWA capabilities

### Desarrollo
- **Angular CLI 19** - Herramientas de desarrollo
- **Karma + Jasmine** - Testing framework

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior)
- **Angular CLI** (versión 19 o superior)

```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@19
```

## 🚀 Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd menu-ginebro-front
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
# Revisa las variables de conexión con el backend
nano src/environments/api.config.ts
```

4. **Edita la configuración (Opcional)**
```typescript
// src/environments/api.config.ts
export const API_CONFIG = {
  baseUrl: 'http://localhost:8001/api/v1',
  timeout: 10000,
  retries: 3
};
```

## 🏃‍♂️ Desarrollo

### Servidor de Desarrollo

```bash
# Inicia el servidor de desarrollo
npm start
# o
ng serve

# Servidor con configuración específica
ng serve --configuration=development

# Servidor con puerto personalizado
ng serve --port 4201
```

La aplicación estará disponible en `http://localhost:4200`

### Comandos Útiles

```bash
# Generar un nuevo componente
ng generate component components/nombre-componente

# Generar un nuevo servicio
ng generate service services/nombre-servicio

# Generar un nuevo guard
ng generate guard guards/nombre-guard

# Ejecutar tests unitarios
ng test
```

## 🏗️ Construcción

### Desarrollo
```bash
ng build --configuration=development
```

### Producción
```bash
ng build --configuration=production
```

Los archivos construidos se almacenarán en `dist/test-menu1/`

### Análisis del Bundle
```bash
ng build --stats-json
npx webpack-bundle-analyzer dist/test-menu1/stats.json
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes reutilizables
│   │   ├── action-button/    # Botón de acción personalizado
│   │   ├── alert/            # Sistema de alertas
│   │   ├── alert-container/  # Contenedor de alertas (Sistema de alertas)
│   │   ├── Auth/             # Componentes de autenticación
│   │   ├── bulk-upload-modal/ # Modal de carga masiva
│   │   ├── footer/           # Pie de página
│   │   ├── icon/             # Componente de iconos
│   │   ├── menu-item/        # Elemento de menú
│   │   ├── navigation-bar/   # Barra de navegación
│   │   ├── order-card/       # Tarjeta de pedido
│   │   ├── otp-input/        # Input para códigos OTP
│   │   ├── password-strength/ # Indicador de fortaleza de contraseña
│   │   ├── school-meal-info/ # Información de comida escolar
│   │   ├── user-avatar/      # Avatar de usuario
│   │   ├── user-card/        # Tarjeta de usuario
│   │   └── weekly-calendar/  # Calendario semanal
│   ├── environments/         # Configuraciones de entorno
│   ├── guards/               # Guards de seguridad
│   ├── interfaces/           # Interfaces TypeScript
│   ├── Services/             # Servicios de la aplicación
│   │   ├── Admin/            # Servicios crm admin
│   │   ├── Alert/            # Servicio de alertas
│   │   ├── Auth/             # Servicio de autenticación
│   │   ├── Menus/            # Servicios de menús
│   │   ├── Orders/           # Servicios de pedidos
│   │   └── User/             # Servicios de usuario
│   └── views/                # Vistas principales
│       ├── forgot-password/  # Recuperación de contraseña
│       ├── login/            # Página de login
│       ├── menu-selection/   # Selección de menús
│       ├── order-history/    # Historial de pedidos
│       ├── orders-dashboard/ # Dashboard de pedidos
│       ├── profile/          # Perfil de usuario
│       ├── student-registration/ # Registro de estudiantes (Register)
│       └── welcome-screen/   # Pantalla de bienvenida (Home)
├── custom-theme.scss          # Tema personalizado
├── index.html                # HTML principal
├── main.ts                   # Punto de entrada
└── styles.css                # Estilos globales
```

## 🔧 Servicios

### Servicios Principales

#### AuthService
```typescript
// Gestión de autenticación
login(credentials: LoginCredentials): Observable<AuthResponse>
logout(): Observable<void>
register(userData: RegisterData): Observable<AuthResponse>
forgotPassword(email: string): Observable<void>
resetPassword(data: ResetPasswordData): Observable<void>
checkAuth(): Observable<User>
checkIfAdmin(): Observable<boolean>
sendRegisterCode(email: string): Observable<any>
completeRegister(data: {
    name: string;
    last_name: string;
    email: string;
    verification_code: number;
    password: string;
    password_confirmation: string;
  }): Observable<any>
resetPassword(data: {
    email: string;
    code: number;
    password: string;
    password_confirmation: string;
  }): Observable<any>
```

#### UserService
```typescript
// Gestión de usuarios
getAll(): Observable<any[]>
getOne(id: number): Observable<any>
create(userData: FormData): Observable<any>
update(id: number, user: { username: string, email: string, password: string, password_confirmation: string, phone: number }): Observable<any>
delete(id: number): Observable<any>
export(format: string): Observable<any>
bulkUpload(data: any): Observable<any>
toggleUser(endpoint: string): Observable<any>
enableUser(id: number): Observable<any>
disableUser(id: number): Observable<any>
```

#### MenuService
```typescript
// Gestión de menús
getByDate(date: string): Observable<any>
export(format: string): Observable<any>
import(body: any): Observable<any>
```

#### OrderService
```typescript
// Gestión de pedidos
getByDate(date: string): Observable<any>
getByUser(userId: number): Observable<any>
updateStatus(orderId: number, statusId: number): Observable<any>
createOrder(order: any): Observable<any>
getOrderTypes(): Observable<any>
checkDateAvailability(date: string): Observable<any>
export(format: string): Observable<any>
```

#### AlertService
```typescript
// Sistema de alertas
show(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, duration = 3000)
```

## 🛡️ Guards y Seguridad

### AuthGuard
Protege rutas que requieren autenticación.

### PublicGuard
Protege rutas públicas.

### AdminGuard
Protege rutas del usuario administrador.

## 🤝 Contribución

### Flujo de Trabajo

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### Estándares de Código

- **TypeScript**: Usar tipos estrictos
- **Angular Style Guide**: Seguir las convenciones oficiales
- **ESLint**: Configuración estándar de Angular
- **Prettier**: Formateo automático de código

### Commits

Usar el formato Conventional Commits:
```
feat: añadir nueva funcionalidad de exportación
fix: corregir error en validación de formulario
docs: actualizar documentación de API
style: mejorar formato de código
refactor: refactorizar servicio de autenticación
test: añadir tests para componente de menú
```

## 📞 Soporte

Para soporte técnico o preguntas:

- **Email**: duck4hats@gmail.com
- **Issues**: [GitHub Issues](https://github.com/DuckHats/menu-ginebro-front/issues)

## 📄 Licencia

Ver el archivo `LICENSE.md` para más detalles.

---

**Desarrollado con ❤️ por Duckhats**