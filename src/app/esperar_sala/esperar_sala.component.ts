import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute,Router } from '@angular/router';
import { GameService } from 'app/game/game.service';

@Component({
  selector: 'app-esperar_sala',
  templateUrl: './esperar_sala.component.html',
  styleUrls: ['./esperar_sala.component.css']
})

export class EsperarSalaComponent {
  numJugadores: number;
  dineroJugador: number = 1500;
  username: string;
  normas: string = "";
  idPartida: number;
  jugadoresLista: string[];
  nombreJugador: string;

  constructor(private http: HttpClient, private userService: UserService, private gameService: GameService,
    private route: ActivatedRoute,private router: Router) {
    
  }

  ngOnInit() {
    // Get id of the game
    const game_id: string | null = this.route.snapshot.paramMap.get('id');
    
    if (game_id != null) {
      this.idPartida = +game_id;
      this.actualizarJugadores();
      setInterval(() => {this.actualizarJugadores();}, 1000);
    } else {
      this.router.navigate(['/error']);
    }

  }


  
  ///partida/listaJugadores
  actualizarJugadores(){
    this.gameService.get_list_players_esperar(this.idPartida).subscribe(
      (response) => {
        this.jugadoresLista = response.map((jugador) => jugador.nombreJugador);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
