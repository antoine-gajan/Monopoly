import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-jail-card',
  templateUrl: './jail-card.component.html',
  styleUrls: ['./jail-card.component.css']
})
export class JailCardComponent {
  @Input() player_money : number = 0;
  @Output() end_turn = new EventEmitter();

  constructor(private gameService : GameService) { }

  validate(){
    this.end_turn.emit();
  }

  pagar() {
    /// TODO: Pay 67€

    // End turn
    this.validate();
  }
}
