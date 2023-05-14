import {Component} from '@angular/core';
import { WebSocketService } from 'app/web-socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pantalla_invitado',
  templateUrl: './pantalla_invitado.component.html',
  styleUrls: ['./pantalla_invitado.component.css']
})

export class PantallaInvitadoComponent {
  form_unirse_invitado: FormGroup;
  username: string ;
  id_partida_nueva: number;
  formSubmitted = false;
  crearSalaClicked = false;
  unirseSalaClicked = false;

  
  constructor(
    //private userService: UserService,
    private fb: FormBuilder,
    private socketService: WebSocketService,
    private router: Router

  ) {
    this.form_unirse_invitado = this.fb.group({
      username: ['', [Validators.required, this.customValidation]],
    });
  }

  ngOnInit() {
    this.socketService.soyInvitado = true;
  }

  customValidation(control: any) {
    const value = control.value;
    if (value.trim() === '') {
      return { 'emptyValue': true };
    }
    return null;
  }


// función que permite volver arriba en la página
volverArriba() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  crearSala() {
    this.crearSalaClicked = true;
    if(this.form_unirse_invitado.valid){
      this.socketService.username = this.form_unirse_invitado.value.username;

      this.socketService.nombreInvitado(this.form_unirse_invitado.value.username);

      console.log("CREAR PARTIDA BOTON PANTALLA");

      this.socketService.crearPartida()
          .then((crearSala: any) => {
            if(crearSala != -1){
              console.log("CREAR SALA: ", crearSala);
              this.socketService.idPartida = crearSala.id;
              this.router.navigate(['/crear_sala']);
            }
          })
          .catch(() => {
            console.log("ERROR AL CREAR SALA");
          });
    }
  }

  unirseSala(){
    this.unirseSalaClicked = true;
    if(this.form_unirse_invitado.valid){
      this.socketService.username = this.form_unirse_invitado.value.username;

      this.socketService.nombreInvitado(this.form_unirse_invitado.value.username);
      this.router.navigate(['/unirse_sala']);
    }
  }
}
