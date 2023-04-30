import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { PlayerListResponse } from 'app/game/response-type';
import { GameService } from 'app/game/game.service';

@Component({
  selector: 'app-unirse_sala',
  templateUrl: './unirse_sala.component.html',
  styleUrls: ['./unirse_sala.component.css']
})
export class UnirseSalaComponent {

  idPartida: number = 1;
  username: string;
  numJugadores: number;
  jugadoresConectadosPartida: string[];
  numeroJugadoresConectados: number = 0;
  maxJugadores: number;
  conectarse: number = 0;

  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private gameService: GameService
  ) {
    this.username = userService.getUsername();
  }

  
  comprobarUnirseSalaDatosEsperar(): number{
    
    console.log("1", this.username, this.idPartida);
    console.log("2");
    //this.userService.getNumJugadores(this.idPartida);
    //this.userService.getNumJugadores(this.idPartida);
    //console.log("3-Numero de jugadores: ", this.numJugadores);
    const datos = { idPartida: this.idPartida };
    this.userService.getNumJugadores(datos).subscribe((numJugadores) => {
      this.maxJugadores = numJugadores;
      console.log("maxPlayers: ", this.maxJugadores);
    });
    console.log("4", this.maxJugadores, this.numeroJugadoresConectados);
    if(this.numeroJugadoresConectados < this.maxJugadores){
      console.log("SE PUEDE CONECTAR");
      //this.userService.unirseSalaEsperar(this.idPartida, this.username);
      //console.log("5");
      this.conectarse = 0;
    }else{
      console.log("NO SE PUEDE CONECTAR");
      this.conectarse = 1;
    }
    return this.conectarse;
    //get_list_players
    //console.log("Unirse partida: ", this.username, this.idPartida);
    /**const datos = {idPartida: this.idPartida, username: this.username};
    this.userService.unirseSalaEsperar(datos);
    console.log("salir unirseSalaDatosEsperar()", this.username, this.idPartida);*/
  }

  unirseSalaDatosEsperar(){
    if(this.comprobarUnirseSalaDatosEsperar() == 1){
      const datos = {idPartida: this.idPartida, username: this.username};
      this.userService.unirseSalaEsperar(datos);
    }

  }
  saberJugadoresConectados(): number{
    console.log("saberJugadoresConectados()");
    this.gameService.get_list_players(this.idPartida).subscribe((response: PlayerListResponse) => {
      this.jugadoresConectadosPartida = response.listaJugadores;
      this.numeroJugadoresConectados = this.jugadoresConectadosPartida.length;
      console.log("CONECTADOS: ", this.jugadoresConectadosPartida);
    });
    return this.numeroJugadoresConectados;
  }


}
