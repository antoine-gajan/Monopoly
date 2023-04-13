import {Component, Input} from '@angular/core';
import {Propriety} from "../propriety";

@Component({
  selector: 'app-propriety-card',
  templateUrl: './propriety-card.component.html',
  styleUrls: ["../../../../node_modules/bootstrap/dist/css/bootstrap.min.css", './propriety-card.component.css']
})
export class ProprietyCardComponent {
  @Input() h : Number;
  @Input() v : Number;

  propriety : Propriety;
  constructor() {}

  get_propriety(){
    /// TODO : Get the property from the server
    if (this.h == 5 || this.v == 5){
      /// Get "festividad"
    }
    else if ((this.h == 0 && this.v == 8) || (this.h == 8 && this.v == 0)){
      /// Get "impuesto"
    }
    else if ((this.h == 10 && this.v == 6) || (this.h == 8 && this.v == 10) || (this.h == 10 && this.v == 0) || (this.h == 0 || this.v == 0)){
      /// Get "tipo special"
    }
  }
}
