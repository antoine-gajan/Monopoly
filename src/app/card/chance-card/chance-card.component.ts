import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  constructor(
    //private gameService: GameService,
    private socketService: WebSocketService
  ) { }

  ngOnInit() {
    this.socketService.suerte()
    .subscribe({
      next: (data) => {
        this.chance = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  trigger_action(){
    this.end_turn.emit();
  }

}
