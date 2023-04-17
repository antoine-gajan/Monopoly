import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AppRoutingModule } from 'app/app-routing.module';
import { Router } from '@angular/router';
import { response } from 'express';

interface EmailInt {
  email: string;
}

@Injectable({
  providedIn: "root"

})
export class CardService {
  constructor(private http: HttpClient) {}
  get_coordenadas(json: any){
    console.log(json);
    return this.http.put('http://localhost:3000/partida/infoAsignatura'/*'http://nerks.net:7003/partida/infoAsignatura'*/, json, {responseType: 'text', observe: 'response'})
  }
}
