import {Component, OnInit} from '@angular/core';
import { UserService } from 'app/user/user.service';
import {Router, ActivatedRoute, NavigationExtras} from "@angular/router";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})

export class PantallaComponent implements OnInit{

  username: string | null;
  id_partida_nueva: number;
  is_loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: WebSocketService,
  ) {
  }

// función que permite volver arriba en la página
volverArriba() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  ngOnInit() {
    this.socketService.soyInvitado = false;
    this.is_loading = true;
    // Get username from browser
    //this.username = localStorage.getItem('username');
    this.username = this.socketService.username;
  }

  crearPartida() {
    console.log("CREAR PARTIDA BOTON PANTALLA");

    this.socketService.crearPartida()
        .then((crearSala: any) => {
          if(crearSala != -1){
            console.log("CREAR SALA: ", crearSala);
            this.socketService.idPartida = crearSala.id;
            // console.log("ID PARTIDA: ", this.socketService.idPartida);
            this.router.navigate(['/crear_sala'], { state: { username: crearSala.username } });

          }
        })
        .catch(() => {
          console.log("ERROR AL CREAR SALA");
        });
  }
}
