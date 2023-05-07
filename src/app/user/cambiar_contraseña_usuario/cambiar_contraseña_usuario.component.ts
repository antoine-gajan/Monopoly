import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { WebSocketService } from 'app/web-socket.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-cambiar_contraseña_usuario',
  templateUrl: './cambiar_contraseña_usuario.component.html',
  styleUrls: ['./cambiar_contraseña_usuario.component.css']
})

export class CambiarContraseñaComponent implements OnInit {
  form: FormGroup;
  passwordShow: boolean = false;
  confirmPasswordShow: boolean = false;
  mensajeCambiado: boolean = false;
  //password: string;
  //confirm_password: string;
  username: string;
  constructor(
    private fb: FormBuilder, 
    //public userService: UserService
    private socketService: WebSocketService
  ){
    this.form = this.fb.group({
      password: ['', [Validators.minLength(8),Validators.required]],
      confirm_password: ['', [Validators.required]]
    });
    this.username = socketService.getUsername();
  }
  get password() {
    return this.form.get('password');
  }

  get confirm_password(){
    return this.form.get('confirm_password');
  }
  ngOnInit(): void {}
  guardar_cambio_password(){
    const nuevo_password = CryptoJS.SHA512(this.form.value.password).toString();
    const nuevo_confirm_password = CryptoJS.SHA512(this.form.value.confirm_password).toString();
    console.log(this.username, this.form.value.password, this.form.value.confirm_password);
    const user = {username: this.username, password: nuevo_password, confirm_password: nuevo_confirm_password, socketId: this.socketService.socketID};
    console.log(user);
    //this.userService.guardar_cambio_password(user);
    this.socketService.guardar_cambio_password(user)
    .then((loginResponse: boolean) => {
      this.mensajeCambiado = !this.mensajeCambiado;
    })
    .catch(() => {
      console.log("Error al cambiar la contraseña");
    });
    this.mensajeCambiado = !this.mensajeCambiado;
    
  }
  passwordMostrarOcultar(){
    this.passwordShow = !this.passwordShow;
  }
  confirmPasswordMostrarOcultar(){
    this.confirmPasswordShow = !this.confirmPasswordShow;
  }
  pulsarBoton(){
    console.log("pulsado");
    location.reload();
    this.mensajeCambiado = !this.mensajeCambiado;
  }
}
