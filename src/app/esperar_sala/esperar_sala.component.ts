import {Component, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute,Router } from '@angular/router';
import { GameService } from 'app/game/game.service';
import { takeWhile, interval } from "rxjs";
import { PlayerListResponse } from "../game/response-type";
import { DatosSalaService } from 'app/user/datos.service';

@Component({
  selector: 'app-esperar_sala',
  templateUrl: './esperar_sala.component.html',
  styleUrls: ['./esperar_sala.component.css']
})

export class EsperarSalaComponent implements OnInit, OnDestroy{
  username: string = "";
  game_id: number;
  list_players: string[] = [];
  player_creator_of_game: string = "";
  nb_players_total: number = 8;
  nb_players_connected: number = 0;
  interval: any;
  boton_empezar_partida: boolean = false;
  showSpinner = false;
  infoUpdated: boolean = false;
  jugadoresSeleccionados: number[];

  //--
  maxPlayers: number;
  veces: number = 0;
  mostrarBotonEmpezar: boolean = false;
  mostrarBotonUnirse: boolean = false;
  mostrarListaJugadores: boolean = false;
  esperarListaJugadores: boolean = false;
  numJugadoresConectados: number = 0;


  constructor(
    private userService: UserService,
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log("ACTUALIZA INFO");
    let idPartida = this.route.snapshot.paramMap.get('id'); // Se obtiene id de la partida
    this.username = this.userService.getUsername();         // Se obtiene el nombre del usuario actual
    if (idPartida != null && this.username != null) {       // Actualiza la información del juego
      this.game_id = +idPartida;
    } else {
      this.router.navigate(['/error']);
    }
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
  }

  ngOnDestroy() {
    // Delete interval
    this.interval.unsubscribe();
    clearInterval(this.interval);
  }
  volver_atras(){
    window.history.back();
  }

  actualize_game_info() {
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
}


  start_game(): void {
    // Stop interval
    // Navigate to /game/game_id
    this.router.navigate(['/game', this.game_id]);
  }

  join_game(): void {
    // Stop interval
    this.interval.unsubscribe();
    clearInterval(this.interval);
    // Navigate to /game/game_id
    this.router.navigate(['/game', this.game_id]);
  }

  /* 
   * Genera el movimiento de reload al hacer click sobre el icono
   * y devuelve la lista de jugadores actualizada
   */
  onRefreshClick(event: any) {
    this.showSpinner = true;
    setTimeout(() => {
      this.showSpinner = false;
    }, 2500);
    this.gameService.get_list_players(this.game_id).subscribe((response: PlayerListResponse) => {
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
    });
  }
}
