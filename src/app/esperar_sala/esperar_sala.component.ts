import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute,Router } from '@angular/router';
import { GameService } from 'app/game/game.service';
import { takeWhile, interval } from "rxjs";
import {PlayerListResponse} from "../game/response-type";

@Component({
  selector: 'app-esperar_sala',
  templateUrl: './esperar_sala.component.html',
  styleUrls: ['./esperar_sala.component.css']
})

export class EsperarSalaComponent {
  username: string = " ";
  game_id: number;
  list_players: string[];
  player_creator_of_game: string = "";
  nb_players_total: number = 8;
  nb_players_connected: number = 0;
  interval: any;

  constructor(private http: HttpClient, private userService: UserService, private gameService: GameService,
              private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    // Get id of the game
    let idPartida = this.route.snapshot.paramMap.get('id');
    // Get player name
    this.username = this.userService.getUsername();
    // Disable every button while info is not loaded
    document.getElementById("start")?.setAttribute("disabled", "true");
    document.getElementById("join")?.setAttribute("disabled", "true");
    // Actualize information of game
    if (idPartida != null && this.username != null) {
      this.game_id = +idPartida;
      this.actualize_game_info();
    } else {
      this.router.navigate(['/error']);
    }

  }

  ngOnDestroy() {
    // Delete interval
    clearInterval(this.interval);
  }


  actualize_game_info() {
    this.interval = interval(2000)
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
            } else {
              // Activate join game button
              document.getElementById("join")?.setAttribute("disabled", "false");
            }
          }
        });
      });
  }

  start_game(): void {
    // Navigate to /game/game_id
    this.router.navigate(['/game', this.game_id]);
  }

  join_game(): void {
    // Navigate to /game/game_id
    this.router.navigate(['/game', this.game_id]);
  }
}
