import {Component, Input, EventEmitter, Output } from '@angular/core';
import {GameService} from "../../game/game.service";
import { WebSocketService } from 'app/web-socket.service';

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
  @Input() is_playing: boolean = false;

  // Define an EventEmitter to emit the "end turn" event of BoardComponent
  @Output() end_turn = new EventEmitter();
  @Output() close_card = new EventEmitter();
  @Output() update_player_info = new EventEmitter();

  constructor(
    private socketService: WebSocketService
  ) {

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
    console.log("ENTRO A COMPRAR UNA CARTA");

    this.socketService.comprarCasilla({socketId: this.socketService.socketID, coordenadas: {h: this.h, v: this.v}})
    .then((ack: any) => {
      console.log("***ACK COMPRA***: ", ack);
      if(ack.cod == 1){
        console.log("Credenciales incorrectas");
      } else if(ack.cod == 2){
        console.log("Error en la funcion");
      } else if(ack.cod == 6){
        console.log("You have bought the card");
        this.update_player_info.emit();
        this.callback();
      } else if(ack.cod == 7){
        console.log("La casilla no estuya");
      } else if(ack.cod == 9){
        alert("No tienes suficiente dinero para comprar esta casilla");
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
    this.socketService.vender({socketId: this.socketService.socketID, coordenadas: {h: this.h, v: this.v}})
    .then((ack: any) => {
      console.log("***ACK VENDER***: ", ack);
      console.log(ack.cod);
      if(ack.cod == 0){
        console.log("OK");
        console.log("Has vendido la casilla");
        console.log(ack);
        // Update properties of player
        this.update_player_info.emit();
        // Callback function
        this.callback();
      } else if(ack.cod == 1 ||ack.cod == 2){
        console.log("ERROR");
        // Try again
        this.sell_card();
      }
    });

  }

  increase_credit_property(){
    this.socketService.aumentarCreditos({ socketId: this.socketService.socketID, coordenadas: {h: this.h, v: this.v}})
    .then((ack: any) => {
      if(ack.cod == 0){
        console.log("***PUEES AUMENTAR CREDITOS***");
      } else if(ack.cod == 1 || ack.cod == 2){
        console.log("***NO PUEDES AUMENTAR CREDITOS***");
        console.log(ack);
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
