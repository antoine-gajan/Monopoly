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

  @Output() end_turn = new EventEmitter();

  constructor(private gameService: GameService) {

  }

  validate() {
    this.end_turn.emit();
  }
}
