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
import { TransactionHistoryComponent } from './views/transaction-history/transaction-history.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: NavigationConfig.LOGIN,
    component: LoginComponent,
    canActivate: [PublicGuard],
  },
  {
    path: NavigationConfig.FORGOT_PASSWORD,
    component: ForgotPasswordComponent,
    canActivate: [PublicGuard],
  },
  { path: NavigationConfig.RESET_PASSWORD, component: ForgotPasswordComponent },
  {
    path: NavigationConfig.REGISTER,
    component: StudentRegistrationComponent,
    canActivate: [PublicGuard],
  },
  {
    path: NavigationConfig.LOGOUT,
    component: LogoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: NavigationConfig.HOME,
    redirectTo: NavigationConfig.MENU_SELECTION,
    pathMatch: 'full',
  }, // Redirigir raíz a selección de menú
  {
    path: NavigationConfig.MENU_SELECTION,
    component: MenuSelectionComponent,
    canActivate: [AuthGuard],
  }, // Ruta para el menú
  {
    path: NavigationConfig.FOOD,
    redirectTo: NavigationConfig.MENU_SELECTION,
    pathMatch: 'full',
  },
  {
    path: NavigationConfig.ADMIN,
    component: OrdersDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  }, // Ruta para la sección de historial de pedidos (admin)
  {
    path: NavigationConfig.HISTORY,
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
  }, // Ruta para la sección de historial
  {
    path: NavigationConfig.PROFILE,
    component: UserCardComponent,
    canActivate: [AuthGuard],
  }, // Ruta para la sección de perfil
  {
    path: NavigationConfig.PAYMENT_TOP_UP,
    component: TopUpComponent,
    canActivate: [AuthGuard, StudentGuard],
  },
  {
    path: NavigationConfig.PAYMENT_RESULT,
    component: PaymentResultComponent,
    canActivate: [AuthGuard, StudentGuard],
  },

  // Subrutas para el admin
  {
    path: NavigationConfig.ADMIN_DAILY,
    component: OrdersDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  }, // Ruta para la sección de historial de pedidos (admin)
  {
    path: NavigationConfig.ADMIN_MONTHLY,
    component: OrdersDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  }, // Ruta para la sección de historial de pedidos (admin)
  {
    path: NavigationConfig.ADMIN_ANUAL,
    component: OrdersDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  }, // Ruta para la sección de historial de pedidos (admin)
  {
    path: NavigationConfig.ADMIN_IMAGE,
    component: OrdersDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  }, // Ruta para la sección de historial de pedidos (admin)
  {
    path: NavigationConfig.ADMIN_TRANSACTIONS,
    component: TransactionHistoryComponent,
    canActivate: [AuthGuard, AdminGuard],
    data: { isAdmin: true },
  },
  {
    path: NavigationConfig.TRANSACTIONS,
    component: TransactionHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: NavigationConfig.MAINTENANCE, component: MaintenanceComponent },

  { path: '**', redirectTo: NavigationConfig.MENU_SELECTION }, // Redirigir cualquier ruta no reconocida a la raíz
];
