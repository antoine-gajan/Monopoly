import {Component, Input, OnInit} from '@angular/core';
import { Propriety } from '../../game/response-type';
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
    console.log("ENTRA A GET PARTY");
    this.socketService.infoAsignatura({coordenadas: {h: this.h, v: this.v}})
    .subscribe({
      next: (data) => {
        this.party = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
