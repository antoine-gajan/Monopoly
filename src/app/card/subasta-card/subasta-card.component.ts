import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input() message: string;
  @Input() is_playing: boolean = false;
  @Output() close_subasta_card = new EventEmitter();
  @Output() trigger_end_turn = new EventEmitter();

  player_subasta: string;
  price_subasta: number;

  ngOnInit(): void {
    // Listen to sockets
    this.socketService.actualizarPuja().subscribe(
      (msg) => {
        console.log(msg);
        this.player_subasta = msg.nombre;
        this.price_subasta = msg.cantidad;
      });

    this.socketService.terminarPuja().subscribe(
      (msg) => {
        console.log("Puja terminada");
        // Close the card
        this.close_subasta_card.emit();
        // End turn if the player is playing
        if(this.is_playing){
          this.trigger_end_turn.emit();
        }
      });
  }

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

  subastar(money: number) {
    this.socketService.pujar({socketId: this.socketService.socketID, cantidad: money}).subscribe({
      next: (msg) => {
        console.log(msg);
        console.log("Se ha pujado + " + money + "€");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
