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
  mostrarBotonUnirse: boolean = true;
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
    this.username = this.socketService.getUsername();         // Se obtiene el nombre del usuario actual
    if (idPartida != null && this.username != null) {       // Actualiza la información del juego
      this.game_id = +idPartida;
    } else {
      this.router.navigate(['/error']);
    }


    this.socketService.actualizarUsuariosConectados(this.game_id)
    .then((usuariosConectados) => {
      console.log('Usuarios conectados:', usuariosConectados);
      this.list_players = usuariosConectados;
      this.mostrarListaJugadores = true;
    })
    .catch((error) => {
      console.error('Error al obtener usuarios conectados:', error);
    });
    
    /*
    
    if(this.veces==0){
      this.mostrarListaJugadores = true;
      console.log("esperar sala: ", this.game_id);
      const datos = { idPartida: this.game_id };
      this.userService.getNumJugadores(datos).subscribe((numJugadores) => {
        this.maxPlayers = numJugadores;
        console.log("maxPlayers: ", this.maxPlayers);
      });
      this.veces = 1;
    }

    if (this.nb_players_connected === this.maxPlayers) {
      if (this.username === this.player_creator_of_game) {
          // Get button with id = "start" from html and activate it
          this.mostrarBotonEmpezar = true;
          this.mostrarBotonUnirse = false;
      } else {
          this.mostrarBotonEmpezar = false;
          this.mostrarBotonUnirse = true;
        }
    }
    */
   
  }

 
  volver_atras(){
    window.history.back();
  }

  actualize_game_info() {
    this.socketService.actualizarUsuariosConectados(this.game_id)
    .then((usuariosConectados) => {
      console.log('Usuarios conectados:', usuariosConectados);
      this.list_players = usuariosConectados;
      this.mostrarListaJugadores = true;
    })
    .catch((error) => {
      console.error('Error al obtener usuarios conectados:', error);
    });
    /*
    this.gameService.get_list_players(this.game_id).subscribe((response: PlayerListResponse) => {
        // Get list of players
        this.list_players = response.listaJugadores;
        // Get number of players connected
        this.nb_players_connected = this.list_players.length;
        // Get creator of game
        this.player_creator_of_game = this.list_players[0];
        console.log("ACTUALIZA INFO: ", this.nb_players_connected, this.maxPlayers);
        if (this.nb_players_connected === this.maxPlayers) {
          if (this.username === this.player_creator_of_game) {
              this.mostrarBotonEmpezar = true;
              this.mostrarBotonUnirse = false;

          } else {
              this.mostrarBotonEmpezar = false;
              this.mostrarBotonUnirse = true;
            }
        }
    });
    */
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
    this.actualize_game_info();
    this.mostrarListaJugadores = true;
    /*this.gameService.get_list_players(this.game_id).subscribe((response: PlayerListResponse) => {
      this.list_players = response.listaJugadores;          // Se obtiene la lista de jugadores
      this.nb_players_connected = this.list_players.length; // Se obtiene el numero de jugadores conectado
      this.player_creator_of_game = this.list_players[0];   // Se obtiene el nombre del usuario del jugadore creador de la partida
      console.log("REFRESH: ", this.nb_players_connected, this.maxPlayers);
      if (this.nb_players_connected === this.maxPlayers) {
        if (this.username === this.player_creator_of_game) {
            this.mostrarBotonEmpezar = true;
            this.mostrarBotonUnirse = false;
        } else {
            this.mostrarBotonEmpezar = false;
            this.mostrarBotonUnirse = true;
          }
      }
    });*/
  }
}
