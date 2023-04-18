import {Component, Input} from '@angular/core';
import {GameService} from "../../game/game.service";

@Component({
  selector: 'app-buy-card',
  templateUrl: './buy-card.component.html',
  styleUrls: ['./buy-card.component.css']
})
export class BuyCardComponent {
  @Input() h = 8;
  @Input() v = 0;
  @Input() game_id : number = 0;
  @Input() username : string = "antoine";
  @Input() message: string = "¿ Quieres comprala ?";
  @Input() play_again: boolean = false;

  mostrarTarjeta = true;

  constructor(private gameService : GameService) {

  }

  ocultarTarjeta() {
    this.mostrarTarjeta = false;
    document.getElementById("tirar-dados")!.removeAttribute("disabled");
    console.log("h: ", this.h, "v: ", this.v);
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

  buy_card() {
    this.gameService.buy_card(this.username, this.game_id, this.h, this.v).subscribe((response) => {
      console.log(response);
      this.ocultarTarjeta();
    });
  }
}
