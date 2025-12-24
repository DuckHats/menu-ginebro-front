import { Routes } from '@angular/router';
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
import { StudentGuard } from './guards/student.guard';
import { TopUpComponent } from './views/payment/top-up/top-up.component';
import { PaymentResultComponent } from './views/payment/result/payment-result.component';
import { MaintenanceComponent } from './views/maintenance/maintenance.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'forgotpassword', component: ForgotPasswordComponent, canActivate: [PublicGuard] },
  { path: 'reset-password', component: ForgotPasswordComponent},
  { path: 'register', component: StudentRegistrationComponent, canActivate: [PublicGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]  },
  { path: '', redirectTo: 'menu-selection', pathMatch: 'full' }, // Redirigir raíz a selección de menú
  { path: 'menu-selection', component: MenuSelectionComponent, canActivate: [AuthGuard] }, // Ruta para el menú
  { path: 'food', redirectTo: 'menu-selection', pathMatch: 'full' }, 
  { path: 'admin', component:  OrdersDashboardComponent, canActivate: [AuthGuard]}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'history', component: OrderHistoryComponent, canActivate: [AuthGuard] }, // Ruta para la sección de historial
  { path: 'profile', component: UserCardComponent, canActivate: [AuthGuard] }, // Ruta para la sección de perfil
  { path: 'payment/top-up', component: TopUpComponent, canActivate: [AuthGuard, StudentGuard] },
  { path: 'payment/result', component: PaymentResultComponent, canActivate: [AuthGuard, StudentGuard] },

  // Subrutas para el admin
  { path: 'admin/daily', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'admin/monthly', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'admin/anual', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: 'admin/image', component:  OrdersDashboardComponent}, // Ruta para la sección de historial de pedidos (admin)
  { path: NavigationConfig.MAINTENANCE, component: MaintenanceComponent },
  
  {path: '**', redirectTo: ''}, // Redirigir cualquier ruta no reconocida a la raíz
];
