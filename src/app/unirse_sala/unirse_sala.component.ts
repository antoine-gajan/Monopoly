import {Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { GameService } from 'app/game/game.service';
import { WebSocketService } from 'app/web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unirse_sala',
  templateUrl: './unirse_sala.component.html',
  styleUrls: ['./unirse_sala.component.css']
})
export class UnirseSalaComponent {

  idPartida: number = 1;
  username: string;
  jugadoresConectadosPartida: string[];
  numeroJugadoresConectados: number = 0;
  maxJugadores: number;
  loading: boolean = false;
  mensajeNoPuedeConectarse: boolean = false;
  seguirMostrando: boolean = false;
  finMensaje: boolean = false;
  errorPartidaLlena: boolean = false;



  constructor(
    private http: HttpClient, 
    private userService: UserService,
    private gameService: GameService,
    private socketService: WebSocketService,
    private router: Router
  ) {

  }

  ngOnInit() {
    
    //this.socketService.hacerOnSocket();
    this.socketService.getSocket().on('esperaJugadores', (mensaje)=>{
      console.log("Usuarios contectados ng: ",mensaje);
      this.socketService.list_players = mensaje;
      const ruta = '/esperar_sala/' + this.idPartida;
      this.router.navigateByUrl(ruta);
    })

  }


  // Función que permitirá o no a un usuario unirse a una sala en función de si hay hueco o no
  async unirseSalaDatosEsperar() {
    const datos = { idPartida: this.idPartida, socketId: this.socketService.socketID};
    this.socketService.getSocket().emit('unirJugador',datos,
    (ack: any)=>{
      if(ack.cod == 4){
        this.finMensaje = true;
        this.errorPartidaLlena = true;
      }
      else{

      }
    });
    // this.socketService.unirseSalaEsperar(datos)
    // .then((unirseSala: number) => {
    //   console.log("unirse SALA: ", unirseSala);
    //   if(unirseSala == 4) {
    //     this.finMensaje = true;
    //     this.errorPartidaLlena = true;
    //   }
    // })
    // .catch(() => {
    //   console.log("ERROR AL CREAR SALA");
    // });
    // const ruta = '/esperar_sala/' + this.idPartida;
    // this.router.navigateByUrl(ruta);
  }

  volverUnirseSala(){
    console.log("VOLVER A UNIRSE A SALA");
    this.loading=false;
    this.finMensaje=false;
    this.mensajeNoPuedeConectarse=false;
    this.errorPartidaLlena = false;
  }
  
}