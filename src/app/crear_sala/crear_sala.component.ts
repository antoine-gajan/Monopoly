import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-crear_sala',
  templateUrl: './crear_sala.component.html',
  styleUrls: ['./crear_sala.component.css']
})
export class CrearSalaComponent {
  numJugadores: number = 2;
  dineroJugador: number = 1500;
  username: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.username = userService.getUsername();

  }

 
  
  
  crearPartidaDatos(){
    console.log("Crear partida: ", this.numJugadores, this.dineroJugador, this.username);
    const datos = {username: this.username, dineroInicial: this.dineroJugador, nJugadores: this.numJugadores};
    this.userService.crearPartida(datos);
  }


  /*enviarDatos() {
        const url = 'http://tu-servidor.com/api/partida';
        const datos = { 
            jugadores: this.numeroJugadores, 
            dinero: this.dineroInicial 
        };

        this.http.post(url, datos)
            .subscribe(
                response => console.log(response),
                error => console.error(error)
            );
    } */
}
