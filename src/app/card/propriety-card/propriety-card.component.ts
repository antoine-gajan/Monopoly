import {Component, Input, OnInit} from '@angular/core';
import {Propriety} from "../propriety";
import { CardService } from '../card.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { CardResponse } from '../cardResponse';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-propriety-card',
  templateUrl: './propriety-card.component.html',
  styleUrls: ["../../../../node_modules/bootstrap/dist/css/bootstrap.min.css", './propriety-card.component.css']
})
export class ProprietyCardComponent implements OnInit{
  nombre: string;  
  precioCompra: number; 
  matricula: number; 
  precio1C: number;  
  precio2C: number; 
  precio3C: number;   
  precio4C: number;  
  devolucionMatricula: string;
  tipo: string;
  coordenadas: {h_coordenadas: number, v_coordenadas: number};
  cuatrimestre: number;       

  
  @Input() h: number = 0;
  @Input() v: number = 0;
  propriety: Propriety;

  constructor(private http: HttpClient, public cardService: CardService) {
  }

  ngOnInit() {
    ///TODO : Initialize proprierty attribute
  }

  get_propriety() {
    /// TODO : Get the property from the server
    const coordenadas = {h: this.h, v: this.v};
    const json = JSON.stringify(coordenadas);
    this.cardService.get_coordenadas(json).subscribe(
      (response) => {
        console.log(response.status);
        console.log("informacion de la tarjeta");
        const body = response.body;
        console.log(json);
        /*if (body) {
          console.log(body.nombre);
          console.log(body.precioCompra);
          console.log(body.matricula);
          console.log(body.precio1C);
          console.log(body.precio2C);
          console.log(body.precio3C);
          console.log(body.precio4C);
          console.log(body.devolucionMatricula);
          console.log(body.tipo);
          console.log(body.cuatrimestre);
        }*/
      },
      (error) => {
        console.log(error);
      }
    );
}

  get_color() {
    if(this.h==10 && (this.v==1 || this.v==2 || this.v==3)){ return "#5e3577";}
    else if (this.h==10 && (this.v==7 || this.v==9)){ return "#b02f7c";}
    else if (this.h==0 && (this.v==1 || this.v==3 || this.v==3)){ return "#41994e";}
    else if(this.h==0 && (this.v==6 || this.v==7 || this.v==9)){ return "#ffed20";}
    else if(this.v==10 && (this.h==1 || this.h==2 || this.h==4)){ return "#d2eaf5";}
    else if(this.v==10 && (this.h==6 || this.h==7 || this.h==9)){ return "#5a6dba";}
    else if(this.v==0 && (this.h==1 || this.h==2 || this.h==4)){ return "#fa811d";}
    else if(this.v==0 && (this.h==7 || this.h==9)){ return "#f50c2b";}
    else return "#f50c2b";
    /*if (this.v == 10 && this.h > 5) return "#b02f7c";
    else if (this.v == 10 && this.h < 5) return "#5e3577";
    else if (this.h == 0 && this.v > 5) return "#5a6dba";
    else if (this.h == 0 && this.v < 5) return "#d2eaf5";
    else if (this.v == 0 && this.h < 5) return "#41994e";
    else if (this.v == 0 && this.h > 5) return "#ffed20";
    else if (this.h == 10 && this.v < 5) return "#fa811d";
    else return "#f50c2b";*/
  }
}
