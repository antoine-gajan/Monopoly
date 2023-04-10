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
import {ProprietyCardComponent} from "./card/propriety-card/propriety-card.component";
import {LeaderboardComponent} from "./game/leaderboard/leaderboard.component";
import {CommunityCardComponent} from "./card/community-card/community-card.component";
import {ChanceCardComponent} from "./card/chance-card/chance-card.component";
import { CrearSalaComponent } from './crear_sala/crear_sala.component';
import { UnirseSalaComponent } from './unirse_sala/unirse_sala.component';
import { TiendaComponent } from './tienda/tienda.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AjustesUsuarioComponent } from './user/ajustes_usuario/ajustes_usuario.component';
import { CambiarUsernameComponent } from './user/cambiar_nombre_usuario/cambiar_nombre_usuario.component';
import { CambiarCorreoComponent } from './user/cambiar_correo_usuario/cambiar_correo_usuario.component';
import { CambiarContraseñaComponent } from './user/cambiar_contraseña_usuario/cambiar_contraseña_usuario.component';
import { DeleteUserComponent } from './user/delete_user/delete_user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'propriety_card', component : ProprietyCardComponent },
  { path: 'chance_card', component : ChanceCardComponent },
  { path: 'community_card', component : CommunityCardComponent },
  { path: 'leaderboard', component : LeaderboardComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: 'board', component: BoardComponent },
  { path: 'pantalla', component: PantallaComponent },
  { path: 'reglas', component: ReglasComponent },
  { path: 'home', component: HomeComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'crear_sala', component: CrearSalaComponent },
  { path: 'unirse_sala', component: UnirseSalaComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'ajustes_usuario', component: AjustesUsuarioComponent },
  { path: 'cambiar_username', component: CambiarUsernameComponent},
  { path: 'cambiar_correo', component: CambiarCorreoComponent},
  { path: 'cambiar_contraseña', component: CambiarContraseñaComponent},
  { path: '', pathMatch: "full", redirectTo: '/home' },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
