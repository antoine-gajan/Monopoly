import {Component, Input, EventEmitter, Output } from '@angular/core';
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-buy-card',
  templateUrl: './buy-card.component.html',
  styleUrls: ['./buy-card.component.css']
})
export class BuyCardComponent {
  @Input() h : number;
  @Input() v : number;
  @Input() game_id : number = 0;
  @Input() username : string = "antoine";
  @Input() message: string = "¿ Quieres comprala ?";
  @Input() play_again: boolean = false;

  // Define an EventEmitter to emit the "end turn" event of BoardComponent
  @Output() end_turn = new EventEmitter();

  constructor(private gameService : GameService) {

  }

  get_type_casilla() {

    if (this.h == 5 || this.v == 5){
      return "party";
    }
    else if (this.h == 0 && this.v == 8){
      return "electricity"
    }
    else if (this.h == 8 && this.v == 0){
      return "heat";
    }
    else{
      return "propriety";
    }
  }

  buy_card() {
    this.gameService.buy_card(this.username, this.game_id, this.h, this.v).subscribe((response) => {
      console.log(response);
      // Call end turn of BoardComponent
      this.callback_end_turn();
    });
  }

  callback_end_turn() {
    this.end_turn.emit();
  }
}
