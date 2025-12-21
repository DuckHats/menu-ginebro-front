import { Routes } from '@angular/router';
import { WelcomeScreenComponent } from './views/welcome-screen/welcome-screen.component';
import { OrdersDashboardComponent } from './views/orders-dashboard/orders-dashboard.component';
import { OrderHistoryComponent } from './views/order-history/order-history.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import MenuSelectionComponent from './views/menu-selection/menu-selection.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './views/login/login.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/Auth/logout/logout.component';
import { StudentRegistrationComponent } from './views/student-registration/student-registration.component';
import { PublicGuard } from './guards/public.guard';
import { NavigationConfig } from './config/navigation.config';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'forgotpassword', component: ForgotPasswordComponent, canActivate: [PublicGuard] },
  { path: 'reset-password', component: ForgotPasswordComponent},
  { path: 'register', component: StudentRegistrationComponent, canActivate: [PublicGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]  },
  { path: '', component: WelcomeScreenComponent, canActivate: [AuthGuard] }, // Ruta raíz
  { path: 'menu-selection', component: MenuSelectionComponent, canActivate: [AuthGuard] }, // Ruta para el menú
  { path: 'food', component:  WelcomeScreenComponent, canActivate: [AuthGuard]}, // Ruta para la sección de comida
  { path: 'admin', component:  OrdersDashboardComponent, canActivate: [AuthGuard]}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'history', component: OrderHistoryComponent, canActivate: [AuthGuard] }, // Ruta para la sección de historial
  { path: 'profile', component: UserCardComponent, canActivate: [AuthGuard] }, // Ruta para la sección de perfil

  // Subrutas para el admin
  { path: 'admin/daily', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'admin/monthly', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'admin/anual', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'admin/image', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: NavigationConfig.MAINTENANCE, loadComponent: () => import('./views/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
  
  {path: '**', redirectTo: ''}, // Redirigir cualquier ruta no reconocida a la raíz
];
