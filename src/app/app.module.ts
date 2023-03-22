import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {PantallaComponent} from "./pantalla/pantalla.component";
import {UserModule} from "./user/user.module";
import {GameModule} from "./game/game.module";
import {ErrorPageComponent} from "./error-page/error-page.component";
import {ContactoComponent} from "./contacto/contacto.component";
import {ReglasComponent} from "./reglas/reglas.component";
import {NosotrosComponent} from "./nosotros/nosotros.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PantallaComponent,
    ErrorPageComponent,
    ContactoComponent,
    NosotrosComponent,
    ReglasComponent,
    ContactoComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    GameModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
