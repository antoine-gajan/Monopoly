import {Component, Input} from '@angular/core';
import {WebSocketService} from "../../web-socket.service";

@Component({
  selector: 'app-subasta-card',
  templateUrl: './subasta-card.component.html',
  styleUrls: ['./subasta-card.component.css']
})
export class SubastaCardComponent {

  constructor(
    private socketService: WebSocketService
  ) {
  }

  @Input() h : number;
  @Input() v : number;
  @Input() game_id : number = 0;
  @Input() message: string;
  player_subasta: string;
  price_subasta: number;

  get_type_casilla() {

    if (this.h == 5 || this.v == 5){
      return "party";
    }
    else if (this.h == 0 && this.v == 8){
      return "electricity"
    }
    else if (this.h == 8 && this.v == 0){
      return "heat";
    }
    else{
      return "propriety";
    }
  }

  subastar() {
    /// TODO : Indicate to backend that we want to subastar
  }

  stop_subastar() {
    /// TODO : Indicate to backend that we want to stop subastar
  }
}
