import {Component, ComponentFactoryResolver, ElementRef, ViewContainerRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GameService } from 'app/game/game.service';
import { DatosSalaService } from 'app/user/datos.service';
import { WebSocketService } from 'app/web-socket.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-crear_sala',
  templateUrl: './crear_sala.component.html',
  styleUrls: ['./crear_sala.component.css']
})
export class CrearSalaComponent {
  numJugadores: number = 2; 
  dineroJugador: number = 1500;
  username: string;
  normas: boolean[] = [];
  idPartida: number;
  current_player: string;
  players_list: [string, number][] = [];
  interval: any;
  jugadoresConectados: string[] = [];
  cobrarCarcel: boolean = false;
  cobrarBeca: boolean = false;
  activarSubasta: boolean = false;
  aumentarCreditos: boolean = false;
  reiniciarJuegoBancarrota: boolean = false;  

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private elRef: ElementRef,
    private datosSalaService: DatosSalaService,
    private socketService: WebSocketService,
    private location: Location
  ){
    this.username = socketService.getUsername();
    this.datosSalaService.numJugadores = this.numJugadores;
  }

  ngOnInit() {
    let username = this.socketService.getUsername();
    this.datosSalaService.numJugadores = this.numJugadores;
  }

  crearPartidaDatos() {
    
    const datos = {
      dineroInicial: this.dineroJugador,
      nJugadores: this.numJugadores,
      normas: {
        cobrarCarcel: this.cobrarCarcel,
        cobrarBeca: this.cobrarBeca,
        activarSubasta: this.activarSubasta,
        aumentarCreditos: this.aumentarCreditos,
        reiniciarJuegoBancarrota: this.reiniciarJuegoBancarrota
      },
      socketId: this.socketService.socketID     
    };
    console.log("CONFIGURACIÓN CREAR PARTIDA: ", datos);

    //this.userService.crearSala(datos);
    this.socketService.crearSala(datos)
        .then((crearSala: boolean) => {
          console.log("CREAR SALA: ", crearSala);
        })
        .catch(() => {
          console.log("ERROR AL CREAR SALA");
        });
  }

  incrementarDinero() {
    if (this.dineroJugador + 100 <= 3500) {
      this.dineroJugador += 100;
    }
  }

  decrementarDinero() {
    if (this.dineroJugador - 100 >= 1500) {
      this.dineroJugador -= 100;
    }
  }
}
