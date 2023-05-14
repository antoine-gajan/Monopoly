import {Component, ComponentFactoryResolver, ElementRef, ViewContainerRef} from '@angular/core';
import { UserService } from 'app/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatosSalaService } from 'app/user/datos.service';
import { WebSocketService } from 'app/web-socket.service';


@Component({
  selector: 'app-crear_sala',
  templateUrl: './crear_sala.component.html',
  styleUrls: ['./crear_sala.component.css']
})
export class CrearSalaComponent {
  private router: Router | null = null;
  numJugadores: number = 2;
  dineroJugador: number = 1000;
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
  list_players: string[] = [];
  partidaCreadaBoton: boolean = false;
  jugar: boolean = false;

  constructor(
    router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private elRef: ElementRef,
    private datosSalaService: DatosSalaService,
    private socketService: WebSocketService,
  ){
    this.router = router;
  }

  ngOnInit() {

    //this.socketService.hacerOnSocket();
    this.list_players[0] = this.socketService.username;
    //console.log("ME HE ADELANTADO");
    this.idPartida = this.socketService.idPartida;
    console.log("ID PARTIDA: ", this.idPartida);
    console.log("LEER USUARIOS");

    this.socketService.getSocket().on('esperaJugadores', (mensaje)=>{
      console.log("Usuarios contectados: ",mensaje);
      this.list_players = mensaje;
      this.socketService.list_players = mensaje;
    })
    // this.socketService.actualizarUsuariosConectados()
    // .subscribe((usuariosConectados) => {
    //   console.log('Usuarios conectados:', usuariosConectados);
    //   this.list_players = usuariosConectados;
    // })
    console.log("LISTA JUGADORES: ", this.list_players);
  }

  empezarJugar() {
    console.log("nos vamos al board");
    //this.actualizarDatos();
    this.jugar = true;
    this.actualizarDatos();
    console.log("JUGAR: ", this.jugar);

    /*
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
      jugar: true,
      socketId: this.socketService.socketID
    };*/

  }
  actualizarDatos(){
    console.log("ACTUALIZAR DATOS");
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
      jugar: this.jugar,
      socketId: this.socketService.socketID
    };
    this.socketService.actualizarDatosCrearPartida(datos);
    console.log(this.numJugadores, this.dineroJugador);
    /*if(datos.jugar == true && this.router!=null){
      const ruta = '/game/' + this.idPartida;
      this.router.navigateByUrl(ruta);
    }*/
  }

  incrementarDinero() {
    if (this.dineroJugador + 500 <= 3000) {
      this.dineroJugador += 500;
    }
    this.actualizarDatos();
  }

  decrementarDinero() {
    if (this.dineroJugador - 500 >= 1000) {
      this.dineroJugador -= 500;
    }
    this.actualizarDatos();
  }

  cobrarCarcelChange(){
    this.cobrarCarcel = !this.cobrarCarcel;
    console.log("Cobrar carcel: ", this.cobrarCarcel);
  }

  cobrarBecaChange(){
    this.cobrarBeca = !this.cobrarBeca;
    console.log("Cobrar beca: ", this.cobrarBeca);
  }

  activarSubastaChange(){
    this.activarSubasta = !this.activarSubasta;
    console.log("Activar subasta: ", this.activarSubasta);
  }

  aumentarCreditosChange(){
    this.aumentarCreditos = !this.aumentarCreditos;
    console.log("Aumentar creditos: ", this.aumentarCreditos);
  }

  reiniciarJuegoBancarrotaChange(){
    this.reiniciarJuegoBancarrota = !this.reiniciarJuegoBancarrota;
    console.log("Reiniciar juego bancarrota: ", this.reiniciarJuegoBancarrota);
  }

}
