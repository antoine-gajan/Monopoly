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
import {AjustesUsuarioComponent} from "./user/ajustes_usuario/ajustes_usuario.component";
import { CambiarContraseñaComponent } from './user/cambiar_contraseña_usuario/cambiar_contraseña_usuario.component';
import { CambiarCorreoComponent } from './user/cambiar_correo_usuario/cambiar_correo_usuario.component';
import { CambiarUsernameComponent } from './user/cambiar_nombre_usuario/cambiar_nombre_usuario.component';
import { DeleteUserComponent } from './user/delete_user/delete_user.component';
import { UserService } from './user/user.service';
import {CardModule} from "./card/card.module";
import {BuyCardComponent} from "./card/buy-card/buy-card.component";
import { CrearSalaComponent } from './crear_sala/crear_sala.component';
import { UnirseSalaComponent } from './unirse_sala/unirse_sala.component';

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
        ContactoComponent,
        AjustesUsuarioComponent,
        CambiarContraseñaComponent,
        CambiarCorreoComponent,
        CambiarUsernameComponent,
        DeleteUserComponent,
        CrearSalaComponent,
        UnirseSalaComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        HttpClientModule,
        //UserModule,
        GameModule,
        CardModule,
        AppRoutingModule,
        ReactiveFormsModule,
        RouterModule],//.forRoot(ROUTES),
    //routing],
    providers: [UserService],
    bootstrap: [AppComponent],
    entryComponents: [BuyCardComponent]
})
export class AppModule { }


