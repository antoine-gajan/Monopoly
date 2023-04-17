import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-unirse_sala',
  templateUrl: './unirse_sala.component.html',
  styleUrls: ['./unirse_sala.component.css']
})
export class UnirseSalaComponent {

  idPartida: number;
  username: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.username = userService.getUsername();
  }

  uniseSalaDatos(){
    console.log("Unirse partida: ", this.username, this.idPartida);
    const datos = {idPartida: this.idPartida, username: this.username};
    this.userService.unirseSala(datos);
  }

}
