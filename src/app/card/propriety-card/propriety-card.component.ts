import {Component, Input, OnInit} from '@angular/core';
import {Propriety} from "../propriety";
import { CardService } from '../card.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';

@Component({
  selector: 'app-propriety-card',
  templateUrl: './propriety-card.component.html',
  styleUrls: ["../../../../node_modules/bootstrap/dist/css/bootstrap.min.css", './propriety-card.component.css']
})
export class ProprietyCardComponent implements OnInit{
  asignatura: string;


  
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
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get_color() {
    if (this.v == 10 && this.h > 5) return "#b02f7c";
    else if (this.v == 10 && this.h < 5) return "#5e3577";
    else if (this.h == 0 && this.v > 5) return "#5a6dba";
    else if (this.h == 0 && this.v < 5) return "#d2eaf5";
    else if (this.v == 0 && this.h < 5) return "#41994e";
    else if (this.v == 0 && this.h > 5) return "#ffed20";
    else if (this.h == 10 && this.v < 5) return "#fa811d";
    else return "#f50c2b";
  }
}
