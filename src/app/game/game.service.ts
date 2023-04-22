import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, tap} from "rxjs";
import {Propriety} from "../card/propriety";
import { environment } from 'enviroment/enviroment';
import { Party } from 'app/card/party';
import {RandomCard} from "../card/chance";
import {PlayerResponse} from "./Player";
@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient,
              private router: Router)  {}

  roll_dices(username: string, idPartida: Number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida, "username": username});

    return this.http.post(environment.lanzarDados, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  get_list_players(idPartida : Number): Observable<String[]>{
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida});

    return this.http.put<String[]>(environment.listaJugadores, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  get_card(username: string, idPartida : number, h : Number, v : number){
    // Function which return the card information (owner, price to pay) and update position
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({  "username": username,
                                                    "coordenadas":{"h": h,"v": v},
                                                    "idPartida": idPartida})
    return this.http.put(environment.casilla, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  buy_card(username: string, idPartida : Number, h : Number, v : Number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({  "username": username,
                                                    "coordenadas":{"h": h,"v": v},
                                                    "idPartida": idPartida})

    return this.http.put(environment.comprarCasilla, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  actualize(idPartida : Number, nJugadores : Number, dineroInicial : Number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida, "nJugadores": nJugadores, "dineroInicial": dineroInicial});
    return this.http.put(environment.actualizarPartida, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  get_info_propriety(v: number, h: number){
    // Return the information of the "Asignatura"
    const body = {"coordenadas":{"h": h,"v": v}};
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<Propriety>(environment.infoAsignatura, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  get_info_party(v: number, h: number){
    // Return information of the "Party" card
    const body = {"coordenadas":{"h": h,"v": v}};
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<Party>(environment.infoAsignatura, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  get_random_suerte_card(idPartida: number, username: string){
    const body =  JSON.stringify({  "idPartida": idPartida,
                                            "username": username,
                                            "tipo": "suerte"
                                        });
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<RandomCard[]>(environment.tarjetaAleatoria, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  get_random_boletin_card(idPartida: number, username: string){
    const body =  JSON.stringify({  "idPartida": idPartida,
                                            "username": username,
                                            "tipo": "boletin"
                                        })
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<RandomCard[]>(environment.tarjetaAleatoria, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  get_all_properties_of_player(idPartida: number, username: string){
    const body =  JSON.stringify({  "idPartida": idPartida,
                                            "username": username
                                        });
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put(environment.listaAsignaturas, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  get_current_player(idPartida: number){
    const body =  JSON.stringify({"idPartida": idPartida});
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<PlayerResponse>(environment.turnoActual, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  next_turn(idPartida: number){
    const body =  JSON.stringify({"idPartida": idPartida});
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put<PlayerResponse>(environment.siguienteTurno, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }
}
