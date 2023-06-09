import {Component, Input, OnInit} from '@angular/core';
import {Propriety} from "../../game/response-type";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-propriety-card',
  templateUrl: './propriety-card.component.html',
  styleUrls: ["../../../../node_modules/bootstrap/dist/css/bootstrap.min.css", './propriety-card.component.css']
})
export class ProprietyCardComponent implements OnInit{
  @Input() h: number = 0;
  @Input() v: number = 0;
  propriety: Propriety;

  constructor(public socketService: WebSocketService) {}

  ngOnInit() {
    this.get_propriety();
  }

  get_propriety() {
    // Get the property from the game service
    this.socketService.infoAsignatura({coordenadas: {h: this.h, v: this.v}})
    .subscribe({
      next: (data) => {
        console.log("infoAsignatura", data);
        this.propriety = data;
      },
      error: (error) => {
        console.log(error);
        // Try again
        setTimeout(() => this.get_propriety(), 2000);
      }
    });

  }

  get_color() {
    if(this.h==0 && (this.v==6 || this.v==7 || this.v==9)){ return "#5a6dba";}
    else if (this.h==10 && (this.v==7 || this.v==9)){ return "#f50c2b";}
    else if (this.h==10 && (this.v==1 || this.v==2 || this.v==4)){ return "#fa811d";}
    else if(this.v==10 && ( this.h==7 || this.h==9)){ return "#b02f7c";}
    else if(this.v==10 && (this.h==1 || this.h==2 || this.h==4)){ return "#5e3577";}
    else if(this.h==0 && (this.v==1 || this.v==2 || this.v==4)){ return "#d2eaf5";}
    else if(this.v==0 && (this.h==1 || this.h==3 || this.h==4)){ return "#41994e";}
    else if(this.v==0 && (this.h==6 || this.h==7 || this.h==9)){ return "#ffed20";}
    else return "#f50c2b";
  }
}
