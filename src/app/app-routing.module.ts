import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import {RegistrationComponent} from "./user/registration/registration.component";
import {BoardComponent} from "./game/board/board.component";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {ProfileComponent} from "./user/profile/profile.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: 'board', component: BoardComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', pathMatch: "full", redirectTo: '/home' },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
