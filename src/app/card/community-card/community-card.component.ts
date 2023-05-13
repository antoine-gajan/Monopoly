import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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

  constructor(
    private socketService: WebSocketService
  ) {}

  ngOnInit() {
    // Get the community card from backend
    this.socketService.boletin()
    .subscribe({
      next: (data) => {
        this.community = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  trigger_action(){
    this.end_turn.emit()
  }
}
