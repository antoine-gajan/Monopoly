import {Component, Input, EventEmitter, Output } from '@angular/core';
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-interaction-card',
  templateUrl: './interaction-card.component.html',
  styleUrls: ['./interaction-card.component.css']
})
export class InteractionCardComponent {
  @Input() h : number;
  @Input() v : number;
  @Input() game_id : number = 0;
  @Input() type : string = "buy";
  @Input() amount_to_pay : number = 0;
  @Input() username : string;
  @Input() player_money : number = 0;
  @Input() message: string;
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
    this.gameService.buy_card(this.username, this.game_id, this.h, this.v).subscribe({
      next: (data) => {
        console.log(data);
        this.callback_end_turn();
    },
    error: (error) => {
      console.log(error);
      alert("You don't have enough money to buy this card");
      this.callback_end_turn();
    }
    });
  }

  callback_end_turn() {
    this.end_turn.emit();
  }

  pay_card() {
    // Call end turn of BoardComponent
    console.log("You have paid " + this.amount_to_pay + "€");
    this.callback_end_turn();
  }
}
