import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { DisplayPageComponent } from './display-page/display-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DisplayPageComponent },
  { path: 'orders', component: DisplayPageComponent },
  { path: 'delivered', component: CompletedOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
