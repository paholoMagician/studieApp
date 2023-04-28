import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrovinculacionComponent } from './components/registrovinculacion/registrovinculacion.component';

const routes: Routes = [

  { path: 'Registro',  component: RegistrovinculacionComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ingreso',   component: LoginComponent },
  { path: '**',      pathMatch: 'full', redirectTo: 'ingreso' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
