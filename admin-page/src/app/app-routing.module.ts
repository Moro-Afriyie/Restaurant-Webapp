import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // children: [
    //   { path: 'orders', component: DisplayPageComponent },
    //   { path: 'delivered', component: CompletedOrdersComponent },
    // ],
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
