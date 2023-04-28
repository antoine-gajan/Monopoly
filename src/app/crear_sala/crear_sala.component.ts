import {Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-crear_sala',
  templateUrl: './crear_sala.component.html',
  styleUrls: ['./crear_sala.component.css']
})
export class CrearSalaComponent {
  numJugadores: number;
  dineroJugador: number = 1500;
  username: string;
  normas: string = "";

  constructor(private http: HttpClient, private userService: UserService) {
    this.username = userService.getUsername();
  }
  
  crearPartidaDatos(){
    console.log("Crear partida: ", this.numJugadores, this.dineroJugador, this.username);
    const datos = {username: this.username, dineroInicial: this.dineroJugador, normas: this.normas, nJugadores: this.numJugadores};
    this.userService.crearPartida(datos);
  }

  esperarSala() {
    const datos = {username: this.username, dineroInicial: this.dineroJugador, normas: this.normas, nJugadores: this.numJugadores};
    console.log("ESPERAR SALA", datos);
    this.userService.esperarSala(datos);
  }

  incrementar() {
    if (this.dineroJugador + 100 <= 3500) {
      this.dineroJugador += 100;
    }
  }

  decrementar() {
    if (this.dineroJugador - 100 >= 1500) {
      this.dineroJugador -= 100;
    }
  }
}
