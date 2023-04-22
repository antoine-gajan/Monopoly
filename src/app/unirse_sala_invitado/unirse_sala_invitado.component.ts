import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-unirse_sala_invitado',
  templateUrl: './unirse_sala_invitado.component.html',
  styleUrls: ['./unirse_sala_invitado.component.css']
})
export class UnirseSalaInvitadoComponent {

  idPartida: number;
  username: string = "1";

  constructor(private http: HttpClient, private userService: UserService) {}

  unirseSalaInvitado(){
    console.log("Unirse partida: ", this.username, this.idPartida);
    const datos = {idPartida: this.idPartida, username: this.username};
    this.userService.unirseSalaInvitado(datos);
  }

}
