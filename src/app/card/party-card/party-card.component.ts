import {Component, Input, OnInit} from '@angular/core';
import {Party} from "../party";
import {Propriety} from "../propriety";
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-party-card',
  templateUrl: './party-card.component.html',
  styleUrls: ['./party-card.component.css']
})
export class PartyCardComponent implements OnInit{
  @Input() h: number = 5;
  @Input() v: number = 10;
  party: Party;
  propriety: Propriety;
  constructor(public gameService: GameService) {}

  ngOnInit() {
    this.get_party();
  }

  get_party() {
    this.gameService.get_info_party(this.v, this.h).subscribe((party) => {
      this.party = party;
    });
  }
}
