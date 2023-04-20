import {Component, ComponentFactoryResolver, ElementRef, ViewContainerRef} from '@angular/core';
import { GameService} from "../game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../user/user.service";
import {BuyCardComponent} from "../../card/buy-card/buy-card.component";
import {ChanceCardComponent} from "../../card/chance-card/chance-card.component";
import {CommunityCardComponent} from "../../card/community-card/community-card.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  game_id : number;
  dices: number[] = [];
  position_player: number = 0;
  current_player: string = "antoine";
  player_name: string;
  special_cards: number[] = [0, 10, 20, 30];
  chance_cards: number[] = [7, 22, 36];
  community_cards: number[] = [2, 17, 33];
  taxes_cards: number[] = [4, 38];

  constructor(private gameService: GameService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, private componentFactoryResolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef, private elRef: ElementRef) { }

  ngOnInit() {
    // Get id of the game
    const game_id : string|null = this.route.snapshot.paramMap.get('id');
    if (game_id != null) {
    this.game_id = +game_id;
  }
  else{
    // Redirect to error page
    this.router.navigate(['/error']);
  }
  // Get name of the player
  this.player_name = this.userService.getUsername();
  // Show position of the player
  this.show_position(this.current_player);
  // Start the game
  this.play();
}
  diceImages = [
    "../../../assets/images/dice/1.png",
    "../../../assets/images/dice/2.png",
    "../../../assets/images/dice/3.png",
    "../../../assets/images/dice/4.png",
    "../../../assets/images/dice/5.png",
    "../../../assets/images/dice/6.png"
  ];



  play(): void{
    /// TODO : Check if the player can play
    // When he can play, activate button
    document.getElementById("tirar-dados")!.removeAttribute("disabled");
    this.gameService.get_random_boletin_card().subscribe({
      next: (data: any) => {
        console.log(data);
      }
    });

    /*this.gameService.get_list_players(this.game_id).subscribe({
      next: (data: any) => {
        console.log(data);
      }
    });*/
  }


  async play_turn_player() {
    // Disable play button to avoid double click
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    // Function to play the turn of a player
    // Roll dices
    this.move_dices_action();
    await this.gameService.roll_dices("antoine", 0).subscribe( {
      next: (data: any) => {
      //this.dices[0] = data.dado1;
      //this.dices[1] = data.dado2;
        this.dices = [0, 2];
      console.log(this.dices);
    },
    error: (error) => {
      console.error(error);
    },
    complete: async () => {
      // Update player position
      this.update_position(this.current_player, this.position_player, this.dices);
      let position_v_h = this.convert_id_to_position(this.position_player);

      // Get card information
      let owner_of_card : string | null = null;
      let money_to_pay : number | null = null;
      this.gameService.get_card(this.current_player, this.game_id, position_v_h[0], position_v_h[1]).subscribe({
        next: (data: any) => {
          owner_of_card = data.jugador;
          money_to_pay = data.dinero;
        },
        error: (error) => {
          console.error(error);
        },
        complete: async () => {
          console.log("Position updated in database");
          // Wait 0.5 seconds
          await this.sleep(500);
          /// TODO : Verify is the player can buy the property and ask to buy it
          // Display a buy card component
          if (this.special_cards.includes(this.position_player)){
            // Do nothing
          }
          else if (this.chance_cards.includes(this.position_player)){
            /// TODO : Display random chance card
            this.createChanceCardComponent(position_v_h[0], position_v_h[1], "Quieres comprar ?", this.dices[0] == this.dices[1]);
          }
          else if (this.community_cards.includes(this.position_player)){
            /// TODO : Display random community card
            this.createCommunityCardComponent(position_v_h[0], position_v_h[1], "Quieres comprar ?", this.dices[0] == this.dices[1]);
          }
          else if (this.taxes_cards.includes(this.position_player)){
            /// TODO : Display tax card and pay
          }
          // If it's a normal card
          else {
            if (owner_of_card == null){
              // Display buy card
              console.log("Display buy card", position_v_h)
              this.createBuyCardComponent(position_v_h[0], position_v_h[1], "Quieres comprar ?", this.dices[0] == this.dices[1]);
            }
            else if (owner_of_card == this.current_player){
              /// TODO : Display a buy card component to ask if the player wants to buy credit
              console.log("You own this property", position_v_h);
            }
            else {
              /// TODO : Display a card to pay the owner
              console.log("Display pay card", position_v_h);
            }
          }
        }
      });
    }
    });
  }

  end_turn(): void{
    ///TODO : Indicate to backend that the player has finished his turn
    // Delete the pop-up-card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    // Go inside the next loop of game
    this.play();
  }

  move_dices_action(): void{
    let count = 0;
      const interval = setInterval(() => {
        this.dices[0] = Math.floor(Math.random() * 6) + 1;
        this.dices[1] = Math.floor(Math.random() * 6) + 1;
        count++;
        if (count === 10) {
          clearInterval(interval);
        }
      }, 200);
  }

  convert_position_to_id(v: number, h: number): number{
    // Function to convert position (v, h) to number between 0 and 39
    console.log("convert_to_id", v, h);
    if (v == 10 && h == 10) {
      return 0;
    }
    else if (v == 0){
      return 20 + h;
    }
    else if (v == 10){
      return 10 - h;
    }
    else if (h == 0){
      return 20 - v;
    }
    else if (h == 10){
      return 30 + v;
    }
    else{
      console.log("Error: x and y are not valid");
      return 0;
    }
  }

  convert_id_to_position(id: number): number[]{
    // Function to convert id to position (v, h)
    if (id == 0) {
      return [10, 10];
    }
    else if (id < 10){
      return [10, 10 - id];
    }
    else if (id < 20){
      return [20 - id, 0];
    }
    else if (id < 30){
      return [0, id - 20];
    }
    else if (id < 40){
      return [id - 30, 10];
    }
    else{
      console.log("Error: position is not valid");
      return [0, 0];
    }
  }

  add_position(id_player: string, id_property: number): void{
    // Function to display position (x, y) in the board
    // Get the property of the element with id = position
    let property = document.getElementById(id_property.toString());
    if (property != null){
      let container_property = property.getElementsByClassName("list-players")[0];
      /// TODO : Add player's image in the center of the property
      // Add a circle on the property
      let player : HTMLElement = document.createElement("div");
      player.id = "player" + id_player.toString();
      player.style.cssText = "background-color: red; border-radius: 50%; width: 30px; height: 30px;";
      container_property.appendChild(player);
    }
    else{
      console.log("Error: position is not valid");
    }
  }

  remove_position(id_player: string): void{
    // Get the div with circle id = id_player
    let player = document.getElementById("player" + id_player.toString());
    // Remove the div
    if (player != null){
      player.remove();
    }
  }

  update_position(id_player: string, old_position: number, dices: number[]){
    // Function to update the position of a player
    // Update position attribute
    let change_turn = this.position_player + dices[0] + dices[1] >= 40;
    this.position_player = (this.position_player + dices[0] + dices[1]) % 40;
    // If player has to go to jail
    if (this.position_player == 30){
      this.position_player = 10;
    }
    // If player has to change turn
    if (change_turn){
      /// TODO : Receive 200€
    }
    // Show position
    this.show_position(id_player);
  }

  show_position(id_player: string): void{
    // Function to display position of id_player in the board
    this.remove_position(id_player);
    this.add_position(id_player, this.position_player);
  }

  createBuyCardComponent(v: number, h: number, message: string = "Quieres comprar", play_again: boolean = false): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(BuyCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.h = h;
    componentRef.instance.v = v;
    componentRef.instance.game_id = this.game_id;
    componentRef.instance.username = this.current_player;
    componentRef.instance.message = message;
    componentRef.instance.play_again = play_again;
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createChanceCardComponent(v: number, h: number, message: string = "", play_again: boolean = false): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(ChanceCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createCommunityCardComponent(v: number, h: number, message: string = "", play_again: boolean = false): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(CommunityCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
