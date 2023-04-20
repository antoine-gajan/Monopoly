import { Component } from '@angular/core';
import {Community} from "../community";
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.css']
})
export class CommunityCardComponent {
  community: Community;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.gameService.get_random_boletin_card().subscribe((community) => {
      console.log(community);
      this.community = community[0];
    });
  }
}
