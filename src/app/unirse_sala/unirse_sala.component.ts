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

  saberJugadoresConectados(){
    console.log("saberJugadoresConectados()");
    this.gameService.get_list_players(this.idPartida).subscribe((response: PlayerListResponse) => {
      this.jugadoresConectadosPartida = response.listaJugadores;
      this.numeroJugadoresConectados = this.jugadoresConectadosPartida.length;
      console.log("CONECTADOS: ", this.numeroJugadoresConectados);
      console.log("1", this.username, this.idPartida, this.numeroJugadoresConectados);
    });  
  }

  async comprobarUnirseSalaDatosEsperar(): Promise<number>{
    await this.saberJugadoresConectados();
    
    const datos = { idPartida: this.idPartida };
    console.log("2", datos);
/*
    this.userService.getNumJugadores(datos).subscribe((numJugadores) => {
      this.maxJugadores = numJugadores;
      console.log("maxPlayers: ", this.maxJugadores);
    });
    
    
    if(this.numeroJugadoresConectados < this.maxJugadores){
      console.log("SE PUEDE CONECTAR");
      //this.userService.unirseSalaEsperar(this.idPartida, this.username);
      //console.log("5");
      this.conectarse = 0;
    }else{
      console.log("NO SE PUEDE CONECTAR");
      this.conectarse = 0;
    }
    return this.conectarse;
*/
    return 0;
  }

  async unirseSalaDatosEsperar() {
    const numeroJugadoresConectados = await this.comprobarUnirseSalaDatosEsperar();
    if (numeroJugadoresConectados == 1) {
      const datos = { idPartida: this.idPartida, username: this.username };
      await this.userService.unirseSalaEsperar(datos);
    }
  }
  
  


}
