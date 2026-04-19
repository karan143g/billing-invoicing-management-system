import { Routes } from '@angular/router';
import { ProductList } from './product/product-list/product-list';
import { CustomerList } from './customer/customer-list/customer-list';
import { InvoiceCreation } from './invoice/invoice-creation/invoice-creation';
import { InvoiceList } from './invoice/invoice-list/invoice-list';
import { Login } from './auth/login/login';
import { AuthGuard } from './auth/auth.guard';
import { AuthLayout } from './auth/auth-layout/auth-layout';
import { MainLayout } from './main-layout/main-layout';
import { Dashboard } from './dashboard/dashboard';
//import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
     {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', component: Login }
    ]
  },
     //{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    
//       {
//     path: '',
//     canActivate: [AuthGuard],
//     children: [
//        { path: 'products', component: ProductList },
//      { path: 'customers', component: CustomerList },
//      {path:'invoice/create',component:InvoiceCreation},
//      {path:'invoice/list',component:InvoiceList}
//     ]
//   }

   {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
       { path: 'products', component: ProductList },
     { path: 'customers', component: CustomerList },
     {path:'invoice/create',component:InvoiceCreation},
     {path:'invoice/list',component:InvoiceList},
     {path:'dashboard', component:Dashboard}
    ]
  },

  { path: '**', redirectTo: '' }

    ];
