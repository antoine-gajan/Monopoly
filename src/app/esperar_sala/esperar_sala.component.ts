import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-esperar_sala',
  templateUrl: './esperar_sala.component.html',
  styleUrls: ['./esperar_sala.component.css']
})
export class EsperarSalaComponent {
  numJugadores: number;
  dineroJugador: number = 1500;
  username: string;
  normas: string = "";

  constructor(private http: HttpClient, private userService: UserService) {
    
  }
}
