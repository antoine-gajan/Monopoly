import {Component, Input, OnInit} from '@angular/core';
import {GameService} from "../../game/game.service";
import {Party} from "../../game/response-type";
import { Propriety } from '../../../../app/game/response-type';
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-party-card',
  templateUrl: './party-card.component.html',
  styleUrls: ['./party-card.component.css']
})
export class PartyCardComponent implements OnInit{
  @Input() h: number;
  @Input() v: number;
  party: Propriety;
  constructor(
    private socketService: WebSocketService
  ) {}

  ngOnInit() {
    this.get_party();
  }

  get_party() {
    this.socketService.infoAsignatura({coordenadas: {h: this.h, v: this.v}})
    .then((msg: any) => {
      console.log("***INFO PARTY***: ", msg);
      this.party = msg;
    })
    .catch(() => {
      console.log("ERROR AL OBTENER INFO PARTY");
      // Try again
      setTimeout(() => this.get_party(), 2000);
    });
  }
}
