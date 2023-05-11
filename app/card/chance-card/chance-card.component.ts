import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {Coordenadas, RandomCard} from "../../game/response-type";
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

  chance: RandomCard;

  constructor(private socketService: WebSocketService) { }

  ngOnInit() {
    this.socketService.suerte()
    .subscribe({
    next:
      (msg) => {
        this.chance = msg;
        console.log(this.chance);
      }
    });
  }

  trigger_action(){
    // Callback function to come back to board
    this.end_turn.emit();
  }

}
