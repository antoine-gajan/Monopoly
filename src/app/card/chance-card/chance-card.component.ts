import { Component } from '@angular/core';
import {Chance} from "../chance";
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-chance-card',
  templateUrl: './chance-card.component.html',
  styleUrls: ['./chance-card.component.css']
})
export class ChanceCardComponent {
  chance: Chance;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.get_random_suerte_card().subscribe((chance) => {
      console.log(chance);
      this.chance = chance[0];
    });
  }
}
