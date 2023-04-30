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

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private datosSalaService: DatosSalaService
  ) {}

  ngOnInit() {

    if(this.veces==0){
      this.userService.getNumJugadores(this.game_id).subscribe(
        (numJugadores) => {
          this.maxPlayers = numJugadores;
        },
        (error) => {
          console.error(error);
        }
      );
      this.veces = 1;
      console.log("maxPlayers: ", this.maxPlayers);
    }
    console.log("ACTUALIZA INFO");

    let idPartida = this.route.snapshot.paramMap.get('id'); // Se obtiene id de la partida
    this.username = this.userService.getUsername(); // Se obtiene el nombre del usuario actual
    document.getElementById("start")?.setAttribute("disabled", "true"); // Se desactiva el botón cuando la información no está actualizada
    document.getElementById("join")?.setAttribute("disabled", "true");  // Se desactiva el botón cuando la información no está actualizada
    if (idPartida != null && this.username != null) { // Actualiza la información del juego
      this.game_id = +idPartida;
    } else {
      this.router.navigate(['/error']);
    }
    /*if (idPartida != null && this.username != null) { // Actualiza la información del juego
      this.game_id = +idPartida;
      if (!this.infoUpdated) {
        this.actualize_game_info();
        this.infoUpdated = true;
      }
    } else {
      this.router.navigate(['/error']);
    }*/
  }

  ngOnDestroy() {
    // Delete interval
    this.interval.unsubscribe();
    clearInterval(this.interval);
  }
  volver_atras(){
    // Stop interval
    this.interval.unsubscribe();
    clearInterval(this.interval);
    window.history.back();
  }

  actualize_game_info() {
    this.interval = interval(5000)
      .pipe(
        // Take while everyone is not connected
        takeWhile(() => this.nb_players_connected !== this.nb_players_total))
      .subscribe(() => {
        this.gameService.get_list_players(this.game_id).subscribe((response: PlayerListResponse) => {
          // Get list of players
          this.list_players = response.listaJugadores;
          // Get number of players connected
          this.nb_players_connected = this.list_players.length;
          // Get creator of game
          this.player_creator_of_game = this.list_players[0];

          if (this.nb_players_connected === this.nb_players_total) {
            if (this.username === this.player_creator_of_game) {
              // Get button with id = "start" from html and activate it
              document.getElementById("start")?.setAttribute("disabled", "false");
              this.boton_empezar_partida = true;
            } else {
              // Activate join game button
              document.getElementById("join")?.setAttribute("disabled", "false");
            }
          }
        });
      });
  }

  start_game(): void {
    // Stop interval
    this.interval.unsubscribe();
    clearInterval(this.interval);
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

      if (this.nb_players_connected === this.nb_players_total) {
        if (this.username === this.player_creator_of_game) {
          // Get button with id = "start" from html and activate it
          document.getElementById("start")?.setAttribute("disabled", "false");
          this.boton_empezar_partida = true;
        } else {
          // Activate join game button
          document.getElementById("join")?.setAttribute("disabled", "false");
        }
      }
    });
  }
}
