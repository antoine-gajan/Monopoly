import {Component, OnInit} from '@angular/core';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'app/game/game.service';
import { PlayerListResponse } from "../game/response-type";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-esperar_sala',
  templateUrl: './esperar_sala.component.html',
  styleUrls: ['./esperar_sala.component.css']
})

export class EsperarSalaComponent implements OnInit{
  username: string = "";
  game_id: number;
  list_players: string[] = [];
  player_creator_of_game: string = "";
  nb_players_connected: number = 0;
  showSpinner = false;
  maxPlayers: number;
  veces: number = 0;
  mostrarBotonEmpezar: boolean = true;
  mostrarBotonUnirse: boolean = false;
  mostrarListaJugadores: boolean = true;

  constructor(
    //private userService: UserService,
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: WebSocketService
  ) {}

  ngOnInit() {
    console.log("ACTUALIZA INFO");
    let idPartida = this.route.snapshot.paramMap.get('id'); // Se obtiene id de la partida
    this.socketService.escucharEntrarAJugar()
    .subscribe((data: any) => {
      console.log("ENTRA A JUGAR: ", data);

      this.mostrarBotonUnirse = true;
    });
    //this.username = this.socketService.getUsername();         // Se obtiene el nombre del usuario actual
    
    /*this.socketService.consultarUsuario()
    .then ((usuario: any) => {
      console.log("usuario: ", usuario);
      this.username = usuario.msg.nombreUser;
    })
    .catch(() => {
      console.log("ERROR AL OBTENER NOMBRE USUARIO");
    });
*/
    if (idPartida != null && this.username != null) {       // Actualiza la información del juego
      this.game_id = +idPartida;
    } else {
      this.router.navigate(['/error']);
    }

    
    this.socketService.actualizarUsuariosConectados()
    .subscribe((usuariosConectados) => {
      console.log('Usuarios conectados:', usuariosConectados);
      this.socketService.list_players = usuariosConectados;
      this.list_players = usuariosConectados;
      this.mostrarListaJugadores = true;
    });

   
   
  }

 
  volver_atras(){
    window.history.back();
  }

  actualize_game_info() {
    /*this.socketService.actualizarUsuariosConectados(this.game_id)
    .then((usuariosConectados) => {
      console.log('Usuarios conectados:', usuariosConectados);
      this.list_players = usuariosConectados;
      this.mostrarListaJugadores = true;
    })
    .catch((error) => {
      console.error('Error al obtener usuarios conectados:', error);
    });*/
    
}

  // Función para acceder al tablero de juego para el creador de la partida
  start_game(): void {
    console.log("start game: ", this.game_id);
    this.mostrarBotonUnirse = true;
    const ruta = '/game/' + this.game_id;
    this.router.navigateByUrl(ruta);
  }

  // Función para acceder al tablero de juego para el resto de jugadores
  join_game(): void {
    console.log("join game: ", this.game_id);
    const ruta = '/game/' + this.game_id;
    this.router.navigateByUrl(ruta);
  }

  /* 
   * Genera el movimiento de reload al hacer click sobre el icono
   * y devuelve la lista de jugadores actualizada
   */
  onRefreshClick() {
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 2500);
    //this.actualize_game_info();

    this.mostrarListaJugadores = true;
  }
}