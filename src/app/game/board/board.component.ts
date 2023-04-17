import {Component, ComponentFactoryResolver, ElementRef, ViewContainerRef} from '@angular/core';
import { GameService} from "../game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../user/user.service";
import {BuyCardComponent} from "../../card/buy-card/buy-card.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  game_id : number;
  dices: number[] = [];
  position_player: number = 0;
  current_player: number = 0;
  player_name: string;
  special_cards: number[] = [0, 10, 20, 30];
  chance_cards: number[] = [7, 22, 36];
  community_cards: number[] = [2, 17, 33];

  constructor(private gameService: GameService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, private componentFactoryResolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef, private elRef: ElementRef) { }

  ngOnInit() {
    //this.play();
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
}

  play(): void{
    /// TODO : Check if the player can play
    this.play_turn_player(this.current_player);
  }

  async play_turn_player(id_player: number) {
    // Function to play the turn of a player
    // Disable play button to avoid double click
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    // Roll dices
    await this.gameService.roll_dices("antoine", 0).subscribe( {
      next: (data: any) => {
      this.dices[0] = data.dado1;
      this.dices[1] = data.dado2;
      console.log(this.dices);
    },
    error: (error) => {
      console.error(error);
    },
    complete: async () => {
      // Update player position
      this.update_position(this.current_player, this.position_player, this.dices);
      // Wait 2 seconds
      await this.sleep(1500);
      /// TODO : Verify is the player can buy the property and ask to buy it
      // Display a buy card component
      let position_v_h = this.convert_id_to_position(this.position_player);
      if (this.special_cards.includes(this.position_player)){
        // Do nothing
      }
      else if (this.chance_cards.includes(this.position_player)){
        /// TODO : Display random chance card
      }
      else if (this.community_cards.includes(this.position_player)){
        /// TODO : Display random community card
      }
      else {
        // Display buy card
        console.log("Display buy card", position_v_h)
        this.createBuyCardComponent(position_v_h[0], position_v_h[1], "Quieres comprar ?", this.dices[0] == this.dices[1]);
      }
      /// TODO : End turn
    }
    });
  }

  get_image_from_dice_value(value: number): String{
    // Function to get the image path from the dice value
    return "../../../assets/images/dice/" + value + ".png";
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

  add_position(id_player : number, id_property : number): void{
    // Function to display position (x, y) in the board
    // Get the property of the element with id = position
    let property = document.getElementById(id_property.toString());
    if (property != null){
      let container_property = property.getElementsByClassName("container")[0];
      /// TODO : Add player's image in the center of the property
      // Add a circle on the property
      let player : HTMLElement = document.createElement("div");
      player.id = "player" + id_player.toString();
      player.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: red; border-radius: 50%; width: 30px; height: 30px;";
      container_property.appendChild(player);
    }
    else{
      console.log("Error: position is not valid");
    }
  }

  remove_position(id_player : number, id_property : number): void{
    // Get the div with circle id = id_player
    let player = document.getElementById("player" + id_player.toString());
    // Remove the div
    if (player != null){
      player.remove();
    }
  }
  update_position(id_player : number, old_position : number, dices : number[]){
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
    // Remove previous position
    this.remove_position(id_player, old_position);
    // Display new position
    this.add_position(id_player, this.position_player);
  }

  createBuyCardComponent(v: number, h: number, message: string = "Quieres comprar", play_again: boolean = false): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(BuyCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.h = h;
    componentRef.instance.v = v;
    componentRef.instance.message = message;
    componentRef.instance.play_again = play_again;
    // Give an id to the component html
    componentRef.location.nativeElement.id = "buy-card-component";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
