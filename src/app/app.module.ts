import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PantallaComponent} from "./pantalla/pantalla.component";
import {GameModule} from "./game/game.module";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {ContactoComponent} from "./contacto/contacto.component";
import {ReglasComponent} from "./reglas/reglas.component";
import {NosotrosComponent} from "./nosotros/nosotros.component";
import {HttpClientModule} from "@angular/common/http";
//import { routing } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';

@NgModule({
  declarations: [ 
    LoginComponent,
    RegistrationComponent,
    AppComponent,
    HomeComponent,
    PantallaComponent,
    ErrorPageComponent,
    ContactoComponent,
    NosotrosComponent,
    ReglasComponent,
    ContactoComponent],
  imports: [ 
    FormsModule,
    BrowserModule,
    HttpClientModule,
    //UserModule,
    GameModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule],//.forRoot(ROUTES), 
    //routing],
  providers: [],
  bootstrap: [AppComponent] 
})
export class AppModule { }


