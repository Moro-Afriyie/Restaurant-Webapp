import { AdminComponent } from './admin/admin.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'orders/:id', component: OrderPageComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'orders', component: DisplayPageComponent },
      { path: 'delivered', component: CompletedOrdersComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
