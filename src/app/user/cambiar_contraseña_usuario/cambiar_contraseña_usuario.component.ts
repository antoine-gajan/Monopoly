import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cambiar_contraseña_usuario',
  templateUrl: './cambiar_contraseña_usuario.component.html',
  styleUrls: ['./cambiar_contraseña_usuario.component.css']
})

export class CambiarContraseñaComponent implements OnInit {

  password: string;
  confirm_password: string;
  username: string;
  constructor( public userService: UserService){
    this.username = userService.getUsername();
  }
  ngOnInit(): void {}
  guardar_cambio_password(){
    console.log(this.username, this.password, this.confirm_password);
    const user = {username: this.username, password: this.password, confirm_password: this.confirm_password};
    console.log(user);
    this.userService.guardar_cambio_password(user);
  }
}
