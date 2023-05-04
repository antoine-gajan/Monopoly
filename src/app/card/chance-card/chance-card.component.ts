import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {Coordenadas, RandomCard} from "../../game/response-type";

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

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.get_random_suerte_card(this.idPartida, this.username).subscribe((chance) => {
      console.log(chance);
      this.chance = chance[0];
    });
  }

  trigger_action(){
    this.gameService.action_of_card(this.idPartida, this.username, this.chance.nombre, this.coordenadas.h, this.coordenadas.v).subscribe({
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
