import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {CartaSuerte, Coordenadas, RandomCard} from "../../game/response-type";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-chance-card',
  templateUrl: './chance-card.component.html',
  styleUrls: ['./chance-card.component.css']
})
export class ChanceCardComponent implements OnInit{
  @Input() idPartida : number;
  @Input() username : string;
  @Input() coordenadas : Coordenadas;
  @Output() end_turn = new EventEmitter();

  chance: CartaSuerte;

  constructor(
    //private gameService: GameService,
    private socketService: WebSocketService
  ) { }

  ngOnInit() {

    this.socketService.suerte()
    .then((msg: any) => {
      console.log("***SUERTE***: ", msg);
      this.chance.cobrarPagarNada = msg.cobrarPagarNada;
      this.chance.descripcion = msg.descripcion;
      this.chance.dinero = msg.dinero;
      this.chance.nombre = msg.descripcion;
      this.chance.tipo = msg.tipo;
      this.chance._id = msg._id;
      console.log("msg: ", msg);
      console.log("this.chance: ", this.chance);
    })
    .catch(() => {
      //console.log(error);
      // Try again
      this.ngOnInit();
    });
  }

  trigger_action(){
    this.socketService.suerte()
    .then((msg: any) => {
      this.chance = msg;
    })
    .catch(() => {
      // Try again
      this.trigger_action();
    });

    // Callback function to come back to board
    this.callback_end_turn();
  }

  callback_end_turn() {
    this.end_turn.emit();
  }

}
