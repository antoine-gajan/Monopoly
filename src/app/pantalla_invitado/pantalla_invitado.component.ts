import {Component} from '@angular/core';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-pantalla_invitado',
  templateUrl: './pantalla_invitado.component.html',
  styleUrls: ['./pantalla_invitado.component.css']
})

export class PantallaInvitadoComponent {

  username: string;
  id_partida_nueva: number;

  constructor(private userService: UserService) {
    this.username = userService.getUsername();
  }

}
