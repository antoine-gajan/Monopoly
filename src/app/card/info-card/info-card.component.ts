import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() button_message: string;
  @Input() trigger_end_turn: boolean = true;

  @Output() end_turn = new EventEmitter();
  @Output() delete_card = new EventEmitter();
  @Output() reStartTimerExpulsarJugador = new EventEmitter()

  constructor(private gameService: GameService) {

  }

  validate() {
    // Restart the timer
    this.reStartTimerExpulsarJugador.emit();
    // If the card enables to continue playing, emit end_turn event
    if (this.trigger_end_turn) {
      this.end_turn.emit();
    }
    // Else, just delete the card
    else {
      this.delete_card.emit();
    }
  }
}
