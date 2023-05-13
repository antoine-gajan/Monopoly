import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {map, Observable, tap} from "rxjs";
import { environment } from 'enviroment/enviroment';
import {
  PlayerResponse,
  PropertyBoughtResponse,
  Party,
  Propriety,
  RandomCard,
  PlayerListResponse,
  PlayerListResponseEspera
} from "./response-type";
import {Socket} from "ngx-socket-io";
import {io} from "socket.io-client";
@Injectable({
  providedIn: 'root'
})
export class GameService {
  socket: any;

  constructor(private http: HttpClient,
              private router: Router)  {
    this.socket = io(environment.socketURL,{ transports: ["websocket"] });
  }

  

 
}