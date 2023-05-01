import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-jail-card',
  templateUrl: './jail-card.component.html',
  styleUrls: ['./jail-card.component.css']
})
export class JailCardComponent {
  @Input() player_name: string;
  @Input() game_id : number;
  @Input() player_money : number = 0;
  @Output() end_turn = new EventEmitter();
  has_card : boolean = false;

  constructor(private gameService : GameService) { }

  ngOnInit(): void {
    // Observe if player has card to go out of jail
    this.has_card_to_go_out();
  }

  has_card_to_go_out(){
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
        }
      }
    );
  }

  use_card_to_go_out(){
    this.gameService.use_card_go_out_of_jail(this.game_id, this.player_name).subscribe(
      (response) => {
        if (response.status == 200){
          this.has_card = false;
          console.log("Carta Julio usada para salir de julio !");
        }
        // End turn
        this.validate();
      }
    );
  }

  validate(){
    this.end_turn.emit();
  }

  pagar() {
    /// TODO: Pay 67€
    // End turn
    this.validate();
  }
}
