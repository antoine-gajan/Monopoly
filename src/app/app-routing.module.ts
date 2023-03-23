import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent} from "./user/registration/registration.component";
import { PantallaComponent } from './pantalla/pantalla.component';
import { ReglasComponent } from './reglas/reglas.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import {ErrorPageComponent} from "./error-page/error-page.component";
import {BoardComponent} from "./game/board/board.component";
import {ProprietyCardComponent} from "./game/propriety-card/propriety-card.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'test_card', component : ProprietyCardComponent},
  { path: 'signup', component: RegistrationComponent },
  { path: 'board', component: BoardComponent },
  { path: 'pantalla', component: PantallaComponent },
  { path: 'reglas', component: ReglasComponent },
  { path: 'home', component: HomeComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: '', pathMatch: "full", redirectTo: '/home' },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
