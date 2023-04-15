import {Component, Input, OnInit} from '@angular/core';
import {Propriety} from "../propriety";

@Component({
  selector: 'app-propriety-card',
  templateUrl: './propriety-card.component.html',
  styleUrls: ["../../../../node_modules/bootstrap/dist/css/bootstrap.min.css", './propriety-card.component.css']
})
export class ProprietyCardComponent implements OnInit{
  @Input() h: number = 0;
  @Input() v: number = 0;
  propriety: Propriety;

  constructor() {
  }

  ngOnInit() {
    ///TODO : Initialize proprierty attribute
  }

  get_propriety() {
    /// TODO : Get the property from the server

  }

  get_color() {
    if (this.v == 10 && this.h > 5) return "#e01a98";
    else if (this.v == 10 && this.h < 5) return "#8b4a9f";
    else if (this.h == 0 && this.v > 5) return "#4a34c5";
    else if (this.h == 0 && this.v < 5) return "#25a3e8";
    else if (this.v == 0 && this.h < 5) return "#18ca0c";
    else if (this.v == 0 && this.h > 5) return "#f6ee02";
    else if (this.h == 10 && this.v < 5) return "#f06809";
    else return "#f82102";
  }
}
