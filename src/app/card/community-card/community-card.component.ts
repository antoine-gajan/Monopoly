import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {RandomCard} from "../chance";

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.css']
})
export class CommunityCardComponent {
  @Input() idPartida : number;
  @Input() username : string;
  @Output() end_turn = new EventEmitter();
  community: RandomCard;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.get_random_boletin_card(this.idPartida, this.username).subscribe((community) => {
      console.log(community);
      this.community = community[0];
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
