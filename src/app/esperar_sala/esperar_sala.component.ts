import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'app/game/game.service';
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
  mostrarListaJugadores: boolean = true;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: WebSocketService
  ) {}

  ngOnInit() {
    // Get id of the game
    let idPartida = this.route.snapshot.paramMap.get('id'); // Se obtiene id de la partida
    if (idPartida != null && this.username != null) {
      // Actualize game info
      this.game_id = +idPartida;
    }
    else {
      this.router.navigate(['/error']);
    }
    this.list_players = this.socketService.list_players;

    // Sockets on to know when the game starts and players connected
    this.socketService.getSocket().on('esperaJugadores', (mensaje)=>{
      console.log("Usuarios contectados: ",mensaje);
      this.list_players = mensaje;
      this.socketService.list_players = mensaje;
    });

    this.socketService.escucharEntrarAJugar()
    .subscribe((data: any) => {
      console.log("ENTRA A JUGAR: ", data);
      // Redirect to game
      this.start_game();
    });
  }


  volver_atras(){
    window.history.back();
  }


  // Function to start the game
  start_game(): void {
    console.log("start game: ", this.game_id);
    const ruta = '/game/' + this.game_id;
    this.router.navigateByUrl(ruta);
  }

}
