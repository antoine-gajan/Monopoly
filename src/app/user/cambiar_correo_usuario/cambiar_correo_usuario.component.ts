import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cambiar_correo_usuario',
  templateUrl: './cambiar_correo_usuario.component.html',
  styleUrls: ['./cambiar_correo_usuario.component.css']
})

export class CambiarCorreoComponent {
  email: string;
  constructor( public userService: UserService
  ) {}
  ngOnInit(): void {}
  guardar_nuevo_correo(){
    const user = {username: this.email};
    this.userService.guardar_nuevo_correo(user);
  }
}
