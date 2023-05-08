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
    // Get username from browser
    this.username = localStorage.getItem('username');
    if (this.username == null) {
      this.router.navigate(['/error']);
    }
    
  }

  crearPartida() {
    console.log("CREAR PARTIDA BOTON PANTALLA");
    this.socketService.crearPartida()
        .then((crearSala: number) => {
          if(crearSala != -1){
            console.log("CREAR SALA: ", crearSala);
            this.socketService.idPartida = crearSala;
            this.router.navigate(['/crear_sala']);
          }
        })
        .catch(() => {
          console.log("ERROR AL CREAR SALA");
        });
        
  }
}
