import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-jail-card',
  templateUrl: './jail-card.component.html',
  styleUrls: ['./jail-card.component.css']
})
export class JailCardComponent {
  // Information of player
  @Input() player_name: string;
  @Input() game_id : number;
  @Input() player_money : number = 0;
  @Output() end_turn = new EventEmitter();
  // Card to go out
  has_card : boolean = false;
  // Dices
  dices_interval: any;
  dices: number[] = [];
  // Relative to dices
  diceImages = [
    "../../../assets/images/dice/1.png",
    "../../../assets/images/dice/2.png",
    "../../../assets/images/dice/3.png",
    "../../../assets/images/dice/4.png",
    "../../../assets/images/dice/5.png",
    "../../../assets/images/dice/6.png"
  ];

  constructor(
    private socketService: WebSocketService
  ) { }

  ngOnInit(): void {
    // Observe if player has card to go out of jail
    this.has_card_to_go_out();
  }

  has_card_to_go_out(){
    //TODO falta de implementar
    /*
    this.gameService.has_card_to_go_out_of_jail(this.game_id, this.player_name).subscribe(
      (response) => {
        console.log(response.status);
        if (response.status == 200){
          this.has_card = true;
        }
        else if (response.status == 205){
          this.has_card = false;
        }
        else {
          console.log("Error al comprobar si tiene carta Julio");
          // Try again
          this.has_card_to_go_out();
        }
      }
    );*/
  }

  use_card_to_go_out(){
    // TODO <- falta implementar
    /*this.gameService.use_card_go_out_of_jail(this.game_id, this.player_name).subscribe(
      (response) => {
        if (response.status == 200){
          this.has_card = false;
          console.log("Carta Julio usada para salir de julio !");
        }
        // End turn
        this.validate();
      }
    );*/
  }

  validate(){
    this.end_turn.emit();
  }

  pagar() {
    /// TODO: Pay 67€
    // End turn
    this.validate();
  }

  roll_dices(): void {
    // Roll dices
    this.move_dices_action();
    this.socketService.lanzarDados()
    .subscribe({
      next: (msg: any) => {
        // Clear dices interval to stop animation
        clearInterval(this.dices_interval);
        // Store true value of dices
        this.dices[0] = msg.dado1;
        this.dices[1] = msg.dado2;
    },
    error: async () =>{
      // Try again
      this.roll_dices();
    },
    complete: async () => {
      // Callback when complete
      console.log("Roll dices to go out of jail completed");
      // End turn
      this.validate();
    }
  });
  }


  move_dices_action(): void{
    // Delete previous interval for safety
    if (this.dices_interval != null) {
      clearInterval(this.dices_interval);
    }
    let count = 0;
      this.dices_interval = setInterval(() => {
        this.dices[0] = Math.floor(Math.random() * 6) + 1;
        this.dices[1] = Math.floor(Math.random() * 6) + 1;
        count++;
        if (count >= 10) {
          clearInterval(this.dices_interval);
        }
      }, 200);
  }
}
