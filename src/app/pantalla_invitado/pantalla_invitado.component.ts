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

  /*constructor(
    //private userService: UserService,
    private fb: FormBuilder,
    private socketService: WebSocketService

  ) {
    this.form_unirse_invitado = this.fb.group({
      username: ['', [Validators.required, this.customValidation]],
    });
  }

  ngOnInit() {
    // If user is already logged in, redirect to home
    //console.log("He llegado al inicio de sesion");
    const schema = yup.object().shape({
      username: yup.string().required()
    });
    this.form_unirse_invitado.valueChanges.subscribe(value => {
      schema.validate(value).catch((err) => {
        console.log(err);
      });
    });
  }

  crearSala(){
    /*console.log("CREAR SALA INVITADO: ", this.form_unirse_invitado.valid, this.form_unirse_invitado.value.username);
    if(this.form_unirse_invitado.valid){
      console.log("CREAR SALA INVITADO: ", this.form_unirse_invitado.value.username);
      const user = {username: this.form_unirse_invitado.value.username, socketId: this.socketService.socketID};
      this.socketService.crearSalaInvitado(user)
        .then((response: boolean) => {
          console.log("Respuesta crear sala: ", response);
        })
        .catch(() => {
          console.log("ERROR crear sala invitado");
        }
      );
    }*
    if(this.form_unirse_invitado.valid){
      console.log("CREAR SALA INVITADO: ", this.form_unirse_invitado.value.username);
      //this.socketService.setUsername(this.form_unirse_invitado.value.username);

      //this.datosUser.usrename = this.form_unirse_invitado.value.username;
      //this.datosUser.idSocket = this.socketService.socketID;

    }
  }

  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  customValidation(control: any) {
    const value = control.value;
    if (value.trim() === '') {
      return { 'emptyValue': true };
    }
    return null;
  }*/

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
