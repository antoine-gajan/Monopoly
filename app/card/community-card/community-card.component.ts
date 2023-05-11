import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {Coordenadas, RandomCard} from "../../game/response-type";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.css']
})
export class CommunityCardComponent implements OnInit{
  @Input() idPartida : number;
  @Input() username : string;
  @Input() coordenadas : Coordenadas;
  @Output() end_turn = new EventEmitter();
  community: RandomCard;

  constructor(private socketService: WebSocketService) { }

  ngOnInit() {
    this.socketService.boletin()
    .subscribe({
    next:
      (msg) => {
        this.community = msg;
        console.log(this.community);
      }
    });
  }

  trigger_action(){ //END TURN
    // Callback function to come back to board
    this.end_turn.emit();
  }

}
