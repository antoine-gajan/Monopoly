import {Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { GameService } from 'app/game/game.service';

@Component({
  selector: 'app-unirse_sala',
  templateUrl: './unirse_sala.component.html',
  styleUrls: ['./unirse_sala.component.css']
})
export class UnirseSalaComponent {

  idPartida: number = 1;
  username: string;
  jugadoresConectadosPartida: string[];
  numeroJugadoresConectados: number = 0;
  maxJugadores: number;
  loading: boolean = false;
  mensajeNoPuedeConectarse: boolean = false;
  seguirMostrando: boolean = false;
  finMensaje: boolean = false;

  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private gameService: GameService
  ) {
    this.username = userService.getUsername();
  }

  // Función que permitirá o no a un usuario unirse a una sala en función de si hay hueco o no
  async unirseSalaDatosEsperar() {
    this.loading = true; // Variable de estado que indica si se está cargando o no
    try {
      const datos = { idPartida: this.idPartida };
      console.log("1", datos);
  
      const response = await this.gameService.get_list_players(this.idPartida).toPromise();
      if (response) {
        this.jugadoresConectadosPartida = response.listaJugadores;
        this.numeroJugadoresConectados = this.jugadoresConectadosPartida.length;
        console.log("CONECTADOS: ", this.numeroJugadoresConectados);
        console.log("2", this.username, this.idPartida, this.numeroJugadoresConectados);
      }
  
      console.log("3", this.username, this.idPartida, this.numeroJugadoresConectados);
      const numJugadores = await this.userService.getNumJugadores(datos).toPromise();
      if (numJugadores !== undefined) {
        this.maxJugadores = numJugadores;
        console.log("maxPlayers: ", this.maxJugadores);
      } else {
        console.log("Error: numJugadores is undefined");
        return;
      }
  
      console.log("4", this.numeroJugadoresConectados, this.maxJugadores);
      if (this.numeroJugadoresConectados < this.maxJugadores) {
        console.log("SE PUEDE CONECTAR");
        const datos = { idPartida: this.idPartida, username: this.username };
        await this.userService.unirseSalaEsperar(datos);
      } else {
        console.log("NO SE PUEDE CONECTAR");
        this.mensajeNoPuedeConectarse = true;
      }
      //this.loading = false; // La ejecución de la función ha terminado
      this.finMensaje = true;
    } catch (error) {
      console.error(error);
      //this.loading = false; // La ejecución de la función ha terminado con error
      // Mostrar un mensaje de error al usuario
      this.finMensaje = true;
    }
  }

  volverUnirseSala(){
    console.log("VOLVER A UNIRSE A SALA");
    this.loading=false;
    this.finMensaje=false;
    this.mensajeNoPuedeConectarse=false;
  }
  
}
