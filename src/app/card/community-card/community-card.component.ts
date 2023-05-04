import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {Coordenadas, RandomCard} from "../../game/response-type";

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

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.get_random_boletin_card(this.idPartida, this.username).subscribe({
    next:
      (cards) => {
        this.community = cards[0];
        console.log(this.community);
      },
    error:
      (error) => {
        console.log(error);
        // Try again in 3 seconds
        setTimeout(() => this.ngOnInit(), 3000);
      }
    });
  }

  trigger_action(){
    this.gameService.action_of_card(this.idPartida, this.username, this.community.nombre, this.coordenadas.h, this.coordenadas.v).subscribe({
      next:
        (data) => {
          console.log(data);
          // Callback function to come back to board
          this.callback_end_turn();
        },
      error:
        (error) => {
          console.log(error);
          // Try again
          this.trigger_action();
        }
    });
  }

  callback_end_turn() {
    this.end_turn.emit();
  }

}
