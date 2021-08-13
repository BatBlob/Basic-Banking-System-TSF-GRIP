import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers.component';
import { HomeComponent } from './home/home.component';
import { TransferBoxComponent } from './transfer-box/transfer-box.component';
import { TransfersComponent } from './transfers/transfers.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'transfers', component: TransfersComponent },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
