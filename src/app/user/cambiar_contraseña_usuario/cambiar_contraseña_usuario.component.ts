import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  constructor(private fb: FormBuilder, public userService: UserService){
    this.form = this.fb.group({
      password: ['', [Validators.minLength(8),Validators.required]],
      confirm_password: ['', [Validators.required]]
    });
    this.username = userService.getUsername();
  }
  get password() {
    return this.form.get('password');
  }

  get confirm_password(){
    return this.form.get('confirm_password');
  }
  ngOnInit(): void {}
  guardar_cambio_password(){
    console.log(this.username, this.form.value.password, this.form.value.confirm_password);
    const user = {username: this.username, password: this.form.value.password, confirm_password: this.form.value.confirm_password};
    console.log(user);
    this.userService.guardar_cambio_password(user);
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
