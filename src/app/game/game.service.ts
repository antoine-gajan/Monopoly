import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient,
              private router: Router)  {}

  roll_dices(username: string, idPartida: Number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida, "username": username});

    return this.http.post("http://localhost:8080/partida/lanzarDados", body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  get_list_players(idPartida : Number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida});

    return this.http.put("http://localhost:8080/partida/listaJugadores", body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  get_card(){
    return this.http.get("http://localhost:8080/partida/casilla").pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  buy_card(username: string, idPartida : Number, h : Number, v : Number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"username": username, "h": h, "v": v, "idPartida": idPartida});

    return this.http.post("http://localhost:8080/partida/comprar", body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  actualize(idPartida : Number, nPJugadores : Number, dineroInicial : Number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida, "nPJugadores": nPJugadores, "dineroInicial": dineroInicial});

    return this.http.put("http://localhost:8080/partida/actualizar", body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));

  }
}
