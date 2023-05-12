import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { FormControl } from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-cambiar_nombre_usuario',
  templateUrl: './cambiar_nombre_usuario.component.html',
  styleUrls: ['./cambiar_nombre_usuario.component.css']
})

export class CambiarUsernameComponent {
  form: FormGroup;
  old_username: string;
  mostrarError: boolean = false;
  idSocket: string;
  ha_entrado: boolean = false;
  //new_username: string;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private socketService: WebSocketService
    //private userService: UserService
  ) {
    this.form = this.fb.group({
      new_username: ['', [Validators.required]]
    });
    //this.old_username = socketService.getUsername();
  }
  get new_username() {
    return this.form.get('new_username');
  }
  ngOnInit() {


    const flag = localStorage.getItem('ha_entrado');
    if (flag === null) {
      this.ha_entrado = false;
    } else {
      this.ha_entrado = JSON.parse(flag);
    }
  
    if (!this.ha_entrado) {
      console.log("ha entrado: ", this.ha_entrado, this.socketService.socketID);
      this.ha_entrado = true;
      this.idSocket = this.socketService.socketID;
      localStorage.setItem('ha_entrado', JSON.stringify(this.ha_entrado));
    }
    //this.old_username = this.socketService.getUsername();

    this.socketService.consultarUsername()
    .then((nombreUsuario: string) => {
      console.log("nombreUser: ", nombreUsuario);
      this.old_username = nombreUsuario;
      //this.socketService.setUsername(nombreUsuario);
    })
    .catch(() => {
      console.log("ERROR AL OBTENER USERNAME");
    });
    this.mostrarError = false;
    console.log('recarga cambiar username: ', this.socketService.socketID);
  }
  
  
  
  
  
  
  
  
  guardar_new_username(){
    //this.socketID = this.socketService.getSocketID();
      if(this.form.valid){
      const username_change = {
        username: this.old_username,
        newusername: this.form.value.new_username,
        socketId: this.socketService.socketID
      };
      console.log("CAMBIAR USERNAME", username_change);
      this.socketService.guardar_new_username(username_change)
        .then((cambio_username: boolean) => {
          this.mostrarError = !cambio_username;
          console.log("CAMBIAR USERNAME", cambio_username);
          this.old_username = this.form.value.new_username;
          //this.socketService.setUsername(this.old_username);
          this.router.navigate(['/ajustes_usuario']);
        })
        .catch(() => {
          this.mostrarError = true;
          console.log("CAMBIAR USERNAME", false);
        });
      }  else {
        console.log("CAMBIAR USERNAME informacion introducida falsa");
      }
  }

  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}