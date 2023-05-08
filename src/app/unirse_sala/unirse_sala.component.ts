import {Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { GameService } from 'app/game/game.service';
import { WebSocketService } from 'app/web-socket.service';
import { Router } from '@angular/router';

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
  errorPartidaLlena: boolean = false;
  list_players: string[] = [];


  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private gameService: GameService,
    private socketService: WebSocketService,
    private router: Router
  ) {
    //this.username = socketService.getUsername();
    this.socketService.consultarUsuario()
    .then ((usuario: any) => {
      console.log("usuario: ", usuario);
      this.username = usuario.msg.nombreUser;
    })
    .catch(() => {
      console.log("ERROR AL OBTENER NOMBRE USUARIO");
    });

    /*this.socketService.actualizarUsuariosConectados()
    .then((usuariosConectados) => {
      console.log('Usuarios conectados:', usuariosConectados);
      this.list_players = usuariosConectados;
    })
    .catch((error) => {
      console.error('Error al obtener usuarios conectados:', error);
    });
    console.log("--", this.list_players);*/
  }

  // Función que permitirá o no a un usuario unirse a una sala en función de si hay hueco o no
  async unirseSalaDatosEsperar() {
    const datos = { idPartida: this.idPartida, socketId: this.socketService.socketID};
    this.socketService.unirseSalaEsperar(datos)
    .then((unirseSala: string) => {
      console.log("unirse SALA: ", unirseSala);
      this.finMensaje = true;
      this.errorPartidaLlena = true;

    
    })
    .catch(() => {
      console.log("ERROR AL CREAR SALA");
    });

    this.socketService.hacerOnSocket();
    const ruta = '/esperar_sala/' + this.idPartida;
    this.router.navigateByUrl(ruta);
  }

  volverUnirseSala(){
    console.log("VOLVER A UNIRSE A SALA");
    this.loading=false;
    this.finMensaje=false;
    this.mensajeNoPuedeConectarse=false;
    this.errorPartidaLlena = false;
  }
  
}
