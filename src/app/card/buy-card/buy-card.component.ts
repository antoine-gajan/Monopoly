import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-buy-card',
  templateUrl: './buy-card.component.html',
  styleUrls: ['./buy-card.component.css']
})
export class BuyCardComponent {
  @Input() h = 8;
  @Input() v = 0;
  @Input() message: string = "Quieres comprar ?";
  @Input() play_again: boolean = false;

  get_type_casilla() {
    if (this.h == 5 || this.v == 5){
      return "party";
    }
    else if (this.h == 0 && this.v == 8){
      return "heat"
    }
    else if (this.h == 8 && this.v == 0){
      return "electricity";
    }
    else{
      return "propriety";
    }
  }

}
