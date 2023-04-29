import {Component, ComponentFactoryResolver, ElementRef, ViewContainerRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GameService } from 'app/game/game.service';
import { DatosSalaService } from 'app/user/datos.service';


@Component({
  selector: 'app-crear_sala',
  templateUrl: './crear_sala.component.html',
  styleUrls: ['./crear_sala.component.css']
})
export class CrearSalaComponent {
  numJugadores: number = 2; 
  dineroJugador: number = 1500;
  username: string;
  normas: string = "";
  idPartida: number;
  current_player: string;
  players_list: [string, number][] = [];
  interval: any;
  jugadoresConectados: string[] = [];

  constructor(
    private gameService: GameService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private elRef: ElementRef,
    private datosSalaService: DatosSalaService
  ){
    this.username = userService.getUsername();
    this.datosSalaService.numJugadores = this.numJugadores;
  }

  ngOnInit() {
    let username = this.userService.getUsername();
    this.datosSalaService.numJugadores = this.numJugadores;
  }

  crearPartidaDatos() {
    console.log("Crear partida: ", this.numJugadores, this.dineroJugador, this.username);
    const datos = {
      username: this.username,
      dineroInicial: this.dineroJugador,
      normas: this.normas,
      nJugadores: this.numJugadores
    };
    this.userService.crearPartida(datos);

  }

  esperarSala() {
    const datos = {
      username: this.username,
      dineroInicial: this.dineroJugador,
      normas: this.normas,
      nJugadores: this.numJugadores
    };
    console.log("ESPERAR SALA", datos);
    this.userService.esperarSala(datos);
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
