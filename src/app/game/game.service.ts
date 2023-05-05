import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {map, Observable, tap} from "rxjs";
import { environment } from 'enviroment/enviroment';
import {
  PlayerResponse,
  PropertiesBoughtResponse,
  Party,
  Propriety,
  RandomCard,
  PlayerListResponse,
  PlayerListResponseEspera
} from "./response-type";
@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private http: HttpClient,
              private router: Router)  {}

  roll_dices(username: string, idPartida: number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida, "username": username});

    return this.http.post(environment.lanzarDados, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  get_list_players(idPartida : number): Observable<PlayerListResponse>{
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({"idPartida": idPartida});

    return this.http.put<PlayerListResponse>(environment.listaJugadores, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  get_card(username: string, idPartida : number, h : number, v : number){
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

  buy_card(username: string, idPartida : number, h : number, v : number){
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

  increase_credit_property(username: string, idPartida : number, h : number, v : number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({  "username": username,
                                                    "coordenadas":{"h": h,"v": v},
                                                    "idPartida": idPartida})

    return this.http.put(environment.aumentar, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  declare_bankruptcy(username: string, idPartida : number){
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    let body = JSON.stringify({  "username": username,
                                                    "idPartida": idPartida})

    return this.http.put(environment.bancarrota, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response);
        }
    ));
  }

  actualize(idPartida : number, nJugadores : number, dineroInicial : number){
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

    return this.http.put<PropertiesBoughtResponse>(environment.listaAsignaturas, body, httpOptions).pipe(
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

  has_card_to_go_out_of_jail(idPartida: number, username: string){
    const body =  JSON.stringify({  "idPartida": idPartida,
                                            "username": username
                                        });

    return this.http.post(environment.cartaJulio, body, { observe: 'response' }).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  use_card_go_out_of_jail(idPartida: number, username: string){
    const body =  JSON.stringify({  "idPartida": idPartida,
                                            "username": username
                                        });

    return this.http.post(environment.usarCartaJulio, body, { observe: 'response' }).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  sell_card(idPartida: number, username: string, h: number, v: number){
    const body =  JSON.stringify({  "idPartida": idPartida,
                                            "username": username,
                                            "coordenadas": {
                                              "h": h,
                                              "v": v
                                            }
                                        });
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post(environment.vender, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );
  }

  action_of_card(idPartida: number, username: string, tarjeta:string, h: number, v: number){
    const body =  JSON.stringify({  "idPartida": idPartida,
                                            "username": username,
                                            "tarjeta": tarjeta,
                                            "coordenadas": {
                                              "h": h,
                                              "v": v
                                            }
                                        });

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    return this.http.put(environment.accionCarta, body, httpOptions).pipe(
      tap(
        (response) => {
          console.log(response)})
      );

  }
}
