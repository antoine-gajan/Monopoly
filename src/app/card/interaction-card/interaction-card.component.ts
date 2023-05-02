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
  @Input() trigger_end_turn: boolean = true;

  // Define an EventEmitter to emit the "end turn" event of BoardComponent
  @Output() end_turn = new EventEmitter();
  @Output() close_card = new EventEmitter();

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
        console.log("You have bought the card");
        console.log(data);
        this.callback();
    },
    error: (error) => {
      console.log(error);
      if (error.status == 400) {
        alert("No tienes suficiente dinero para comprar esta casilla");
        this.callback();
      }
      else {
        // Try again to buy
        this.buy_card();
      }
    }
    });
  }

  increase_credit_property(): void {
    this.gameService.increase_credit_property(this.username, this.game_id, this.h, this.v).subscribe({
      next: (data) => {
        console.log("You have increased the card");
        console.log(data);
        this.callback();
    },
    error: (error) => {
      console.log(error);
      if (error.status == 400) {
        alert("No puedes aumentar el numero de credito de esta casilla");
      }
      this.callback();
    }
    });
  }

  pay_card() {
    // Call end turn of BoardComponent
    console.log("You have paid " + this.amount_to_pay + "€");
    this.callback();
  }

  sell_card() : void {
    // Sell card with database
    this.gameService.sell_card(this.game_id, this.username, this.h, this.v).subscribe({
      next: (data) => {
        console.log("Has vendido la casilla");
        console.log(data);
        // Callback function
        this.callback();
      },
      error: (error) => {
        console.log(error);
        if (error.status == 400) {
          alert("No puedes vender esta casilla");
        }
        // Callback function
        this.callback();
      }
    });
  }

  callback(){
    if (this.trigger_end_turn) {
      this.end_turn.emit();
    }
    else {
      this.close_card.emit();
    }
  }
}
