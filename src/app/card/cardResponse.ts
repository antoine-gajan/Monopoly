import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface CardResponse {
  nombre: string;
  precioCompra: number;
  matricula: string;
  precio1C: number;
  precio2C: number;
  precio3C: number;
  precio4C: number;
  devolucionMatricula: boolean;
  tipo: string;
  cuatrimestre: string;
}

export class CardService {
  private url = 'https://api.example.com/card';

  constructor(private http: HttpClient) { }

  get_coordenadas(json: any): Observable<CardResponse> {
    return this.http.put<CardResponse>(this.url, json);
  }
}
