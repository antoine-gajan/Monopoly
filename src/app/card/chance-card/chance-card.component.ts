import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {RandomCard} from "../../game/response-type";

@Component({
  selector: 'app-chance-card',
  templateUrl: './chance-card.component.html',
  styleUrls: ['./chance-card.component.css']
})
export class ChanceCardComponent {
  @Input() idPartida : number;
  @Input() username : string;
  @Output() end_turn = new EventEmitter();

  chance: RandomCard;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.get_random_suerte_card(this.idPartida, this.username).subscribe((chance) => {
      console.log(chance);
      this.chance = chance[0];
    });
  }

   callback_end_turn() {
    this.end_turn.emit();
  }

  validate() {
    // Call end turn of BoardComponent
    console.log("Validate community card");
    this.callback_end_turn();
  }
}
