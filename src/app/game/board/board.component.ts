import {Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import { GameService} from "../game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../user/user.service";
import {InteractionCardComponent} from "../../card/interaction-card/interaction-card.component";
import {ChanceCardComponent} from "../../card/chance-card/chance-card.component";
import {CommunityCardComponent} from "../../card/community-card/community-card.component";
import {EMPTY, firstValueFrom, interval, startWith, switchMap, takeWhile} from "rxjs";
import {InfoCardComponent} from "../../card/info-card/info-card.component";
import {JailCardComponent} from "../../card/jail-card/jail-card.component";
import {PropertiesBoughtResponse} from "../Player";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  game_id : number;
  dices: number[] = [];
  position_player: number = 0;
  current_player: string;
  player: [string, number] = ["antoine", 200];
  other_players_list: [string, number][] = [];
  nothing_cards: number[] = [0, 10, 20];
  prison_cards: number[] = [30];
  chance_cards: number[] = [7, 22, 36];
  community_cards: number[] = [2, 17, 33];
  taxes_cards: number[] = [4, 38];
  player_properties: PropertiesBoughtResponse;
  diceImages = [
    "../../../assets/images/dice/1.png",
    "../../../assets/images/dice/2.png",
    "../../../assets/images/dice/3.png",
    "../../../assets/images/dice/4.png",
    "../../../assets/images/dice/5.png",
    "../../../assets/images/dice/6.png"
  ];
  // Variables for the game component
  message: string;
  interval: any;

  constructor(private gameService: GameService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, private componentFactoryResolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef, private elRef: ElementRef) { }

  ngOnInit() {
    // Get id of the game
    const game_id: string | null = this.route.snapshot.paramMap.get('id');
    if (game_id != null) {
      this.game_id = +game_id;
    } else {
      // Redirect to error page
      this.router.navigate(['/error']);
    }
    // Get name of the player
    this.player[0] = this.userService.getUsername();
    // If undefined, redirect to error page
    if (this.player[0] === undefined) {
      this.router.navigate(['/error']);
    }
    // Load game
    this.load_game();
  }

  ngOnDestroy() {
    // Destroy the interval
    clearInterval(this.interval);
  }


  load_game(){
    // Block buttons to avoid risks
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    // Indicate that the game is loading
    this.message = "Cargando la partida..."
    // Get list of players
    this.gameService.get_list_players(this.game_id).subscribe({
      next: (data: any) => {
        this.other_players_list = data.listaTuplas;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        // Delete client from other_players_list
        this.delete_client_from_other_list();
        // Get every properties of each player
        this.get_properties();
        // Show position of the players
        this.show_position_every_players();
        // Indicate that the game is loaded
        this.message = "Partida cargada";
        // Start the game
        this.play();
      }
    });
  }

  get_properties(): void {
    // Get every properties of the player
    this.gameService.get_all_properties_of_player(this.game_id, this.player[0]).subscribe({
      next: (data: PropertiesBoughtResponse) => {
        this.player_properties = data;
        console.log(this.player_properties);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  async play(): Promise<void> {
    // Ensure to execute the interval only once
    this.current_player = "";
    // Check if the player can play or not
    this.interval = interval(5000)
      .pipe(
        // Take while the current player is not the current user's player
        takeWhile(() => this.current_player !== this.player[0]),
        switchMap(() => this.gameService.get_current_player(this.game_id)),
        switchMap((playerResponse) => {
          this.current_player = playerResponse.jugador;
      if (this.current_player === this.player[0]) {
        // When he can play, activate button
        this.message = this.player[0] + ", es tu turno";
        document.getElementById("tirar-dados")!.removeAttribute("disabled");
        // Return empty observable to stop the interval
        return EMPTY;
      } else {
        // If it's not his turn, indicate who is playing
        this.message = this.current_player + " está jugando su turno";
        // Update game information
        return this.gameService.get_list_players(this.game_id);
      }
    })
  )
  .subscribe({
    next : (data: any) => {
      this.other_players_list = data.listaTuplas;
    },
    error: (error) => {
      console.error(error);
      // Try again
      this.play();
    },
    complete: () => {
      // Delete client from other_players_list
      this.delete_client_from_other_list();
      // TODO : Update position of the players
      this.show_position_every_players();
    }
    });
  }

  delete_client_from_other_list(): void {
    // Get money of player_name and delete player from other_players_list
    for (let i = 0; i < this.other_players_list.length; i++) {
      if (this.other_players_list[i][0] === this.player[0]) {
        // Get money of the player
        this.player[1] = this.other_players_list[i][1];
        // Remove client from other_players_list
        this.other_players_list.splice(i, 1);
      }
    }
  }

  show_position_every_players(): void {
    // Show position of the player
    this.show_position(this.player[0], this.position_player,0);
    // Show position of the other players
    for (let i = 0; i < this.other_players_list.length; i++) {
      this.show_position(this.other_players_list[i][0], 0, i + 1);
    }
  }

  async play_turn_player() {
    // Disable play button to avoid double click
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    // Function to play the turn of a player
    // Roll dices
    this.move_dices_action();
    this.gameService.roll_dices(this.player[0], this.game_id).subscribe( {
      next: (data: any) => {
      this.dices[0] = data.dado1;
      this.dices[1] = data.dado2;
    },
    error: async (error) => {
      // Wait 1 second
      await this.sleep(1000);
      // Try again
      this.play_turn_player();
    },
    complete: async () => {
      // Update message
      if (this.dices[0] === this.dices[1]){
        this.message = this.player[0] + ", has sacado dobles " + this.dices[0];
      }
      else {
        this.message = this.player[0] + ", has sacado " + this.dices[0] + " y " + this.dices[1];
      }
      // Update player position
      let jail = await this.update_local_player_position(this.player[0], this.position_player, this.dices);
      // Action of the card
      this.card_action(jail);
    }
    });
  }

  async card_action(is_in_jail: boolean) {
    let position_v_h = this.convert_id_to_position(this.position_player);
    // Get card information
    let owner_of_card: string | null = null;
    let money_to_pay: number | null = null;
    this.gameService.get_card(this.player[0], this.game_id, position_v_h[0], position_v_h[1]).subscribe({
      next: (data: any) => {
        owner_of_card = data.jugador;
        money_to_pay = data.dinero;
      },
      error: (error) => {
        console.error(error);
        // Try again
        this.card_action(is_in_jail);
      },
      complete: async () => {
        // Wait 0.5 seconds
        await this.sleep(500);
        // Display a buy card component
        if (is_in_jail) {
          // Display a jail card component
          this.createJailCardComponent();
        }
        if (this.nothing_cards.includes(this.position_player)) {
          this.message = "No pasa nada";
          // End turn
          this.end_turn();
        } else if (this.chance_cards.includes(this.position_player)) {
          // Wait 0.5 seconds
          await this.sleep(500);
          this.message = "Toma una carta de suerte";
          this.createChanceCardComponent();
        } else if (this.community_cards.includes(this.position_player)) {
          // Wait 0.5 seconds
          await this.sleep(500);
          this.message = "Toma una carta de comunidad";
          this.createCommunityCardComponent();
        } else if (this.taxes_cards.includes(this.position_player)) {
          this.message = "Tienes que pagar...";
          if (this.position_player == 38) {
            this.createInfoCardComponent("SEGURO ESCOLAR", "Tienes que pagar el seguro escolar : 133€", "Pagar 133€");
          } else if (this.position_player == 4) {
            this.createInfoCardComponent("APERTURA DE EXPEDIENTE", "Tienes que pagar la apertura de expediente : 267€", "Pagar 267€");
          }
        }
        // If it's a normal card
        else {
          if (owner_of_card == null) {
            // Display buy card
            this.createBuyCardComponent(position_v_h[0], position_v_h[1], "Quieres comprar ?", this.player[1], this.dices[0] == this.dices[1]);
          } else if (owner_of_card == this.player[0]) {
            /// TODO : Display a buy card component to ask if the player wants to buy credit
            console.log("You own this property", position_v_h);
          } else if (owner_of_card != this.player[0] && money_to_pay != null && money_to_pay <= this.player[1]) {
            console.log("Display pay card", position_v_h);
            this.createPayCardComponent(position_v_h[0], position_v_h[1], "La tarjeta pertenece a " + owner_of_card, this.player[1], money_to_pay);
          } else if (owner_of_card != this.player[0] && money_to_pay != null && money_to_pay > this.player[1]) {
            this.createInfoCardComponent("BANCARROTA", "Has perdido...<br>No tienes suficiente dinero para pagar " + money_to_pay + "€ a " + owner_of_card + " !", "Vale");
          }
        }
      }
    });
  }

  end_turn(): void {
    // Update properties
    this.get_properties();
    // Delete the pop-up-card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null) {
      old_buy_card_component_element.remove();
    }
    /// TODO: Get the position of the player from the backend
    let old_position_player = this.position_player;
    // If the player can play again, activate the button to play again
    if (this.dices[0] === this.dices[1]) {
      this.message = this.player[0] + ", puedes volver a tirar los dados";
      document.getElementById("tirar-dados")!.removeAttribute("disabled");
    }
    // If the position of player has changed, launch card action of the new position
    else if (this.position_player != old_position_player) {
      if (this.position_player == 10) {
        // Player has be sent to jail-card
        this.card_action(true);
      } else {
        this.card_action(false);
      }
    }
    else {
      this.message = "Has terminado tu turno";
      // Indicate to backend that the player has finished his turn
      this.gameService.next_turn(this.game_id).subscribe({
        next: (data) => {
          this.current_player = data.jugador;
          console.log(data);
        },
        error: (error) => {
          console.error(error);
          this.end_turn();
        },
        complete: () => {
          this.message = "Es el turno de " + this.current_player;
          // Go back to play to wait next time to play
          this.play();
        }
      });
    }
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

  add_position(id_player: string, id_property: number, index_color: number): void{
    // Function to display position (x, y) in the board
    // Get the property of the element with id = position
    let property = document.getElementById(id_property.toString());
    if (property != null){
      let container_property : Element = property.getElementsByClassName("list-players")[0];
      // Add a circle on the property
      let player : HTMLElement = document.createElement("div");
      player.id = "player" + id_player.toString();
      player.style.cssText = "background-color: " + this.get_token_color_from_index(index_color)+ "; border-radius: 50%; width: 30px; height: 30px;";
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

  async update_local_player_position(id_player: string, old_position: number, dices: number[]) {
    // Function to update the position of a player
    // Update position attribute
    let change_turn = this.position_player + dices[0] + dices[1] >= 40;
    this.position_player = (this.position_player + dices[0] + dices[1]) % 40;
    let jail = this.position_player == 30;
    // If change turn, receive 200
    if (change_turn){
      this.message = "Has pasado por la salida";
      this.player[1] += 200;
      // Wait 0.5 seconds
      await this.sleep(500);
    }
    // If player has to go to jail-card
    if (this.position_player == 30) {
      this.show_position(id_player, this.position_player, 0);
      this.message = "Has ido en julio";
      // Wait 0.5 seconds
      await this.sleep(500);
      this.position_player = 10;
    }
    // Show position
    this.show_position(id_player, this.position_player, 0);
    return jail;
  }

  show_position(id_player: string, property_id: number, index_color: number): void{
    // Function to display position of id_player in the board
    this.remove_position(id_player);
    this.add_position(id_player, property_id, index_color);
  }

  createBuyCardComponent(v: number, h: number, message: string = "Quieres comprar", money: number, play_again: boolean = false): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(InteractionCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.h = h;
    componentRef.instance.v = v;
    componentRef.instance.game_id = this.game_id;
    componentRef.instance.username = this.player[0];
    componentRef.instance.message = message;
    componentRef.instance.play_again = play_again;
    componentRef.instance.player_money = money;
    componentRef.instance.type = "buy";
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createPayCardComponent(v: number, h: number, message: string = "Debes pagar...", money: number, amount_to_pay: number): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(InteractionCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.h = h;
    componentRef.instance.v = v;
    componentRef.instance.game_id = this.game_id;
    componentRef.instance.username = this.player[0];
    componentRef.instance.message = message;
    componentRef.instance.type = "pay";
    componentRef.instance.player_money = money;
    componentRef.instance.amount_to_pay = amount_to_pay;
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createChanceCardComponent(): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(ChanceCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.idPartida = this.game_id;
    componentRef.instance.username = this.player[0];
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createCommunityCardComponent(): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(CommunityCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.idPartida = this.game_id;
    componentRef.instance.username = this.player[0];
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createInfoCardComponent(title : string, description: string, button_text : string): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(InfoCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.title = title;
    componentRef.instance.description = description;
    componentRef.instance.button_message = button_text;
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createJailCardComponent(): void {
    // Assure to delete the old buy card component
    const old_buy_card_component_element = document.getElementById('pop-up-card');
    if (old_buy_card_component_element != null){
      old_buy_card_component_element.remove();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(JailCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    componentRef.instance.player_money = this.player[1];
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  get_token_color_from_index(index: number): string{
    // Function to get the color of the token from the index
    switch(index){
      case 0:
        return "red";
      case 1:
        return "blue";
      case 2:
        return "green";
      case 3:
        return "yellow";
      case 4:
        return "purple";
      case 5:
        return "orange";
      case 6:
        return "pink";
      case 7:
        return "brown";
      default:
        return "black";
    }
  }

  sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
