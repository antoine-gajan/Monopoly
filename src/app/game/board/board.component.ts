import {Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {GameService} from "../game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../user/user.service";
import {InteractionCardComponent} from "../../card/interaction-card/interaction-card.component";
import {ChanceCardComponent} from "../../card/chance-card/chance-card.component";
import {CommunityCardComponent} from "../../card/community-card/community-card.component";
import {EMPTY, Observable, forkJoin, interval, switchMap, takeWhile} from "rxjs";
import {InfoCardComponent} from "../../card/info-card/info-card.component";
import {JailCardComponent} from "../../card/jail-card/jail-card.component";
import {Coordenadas, Partida, PlayerListResponse, PropertyBoughtResponse} from "../response-type";
import {DevolutionPropertiesFormComponent} from "../devolution-properties-form/devolution-properties-form.component";
import { WebSocketService } from 'app/web-socket.service';
import {SubastaCardComponent} from "../../card/subasta-card/subasta-card.component";
import { AlertComponent } from 'app/card/alert/alert.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {
  // Game variables
  game_id : number;
  dices: number[] = [];
  current_player: string;
  username: string;

  // Relative to client player
  player: [string, number, Coordenadas] = ["", 0, {h: 10, v: 10}];
  nb_doubles: number = 0;
  is_playing: boolean = false;
  is_in_jail: boolean = false;
  is_bankrupt: boolean = false;
  player_properties: [string, Coordenadas][] = [];
  timer: any;
  is_timer_active: boolean = false;
  remaining_time: number = 0;

  // Relative to other players
  other_players_list: [string, number, Coordenadas][] = [];
  other_player_properties: {[player_username: string]: [string, Coordenadas][]} = {};

  // Relative to the board and cards positions
  nothing_cards: number[] = [0, 10, 20, 30];
  chance_cards: number[] = [7, 22, 36];
  community_cards: number[] = [2, 17, 33];
  taxes_cards: number[] = [4, 38];


  // Relative to dices
  diceImages = [
    "../../../assets/images/dice/1.png",
    "../../../assets/images/dice/2.png",
    "../../../assets/images/dice/3.png",
    "../../../assets/images/dice/4.png",
    "../../../assets/images/dice/5.png",
    "../../../assets/images/dice/6.png"
  ];

  // Variables for the game functionning
  message: string;
  interval_play: any;
  dices_interval: any;

  list_players: string[] = [];

  constructor(

    private gameService: GameService, private userService: UserService, private route: ActivatedRoute,
              private router: Router, private componentFactoryResolver: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef, private elRef: ElementRef,    private socketService: WebSocketService) { }

  /* === FUNCTIONS TO INITIALIZE AND DESTROY THE GAME === */
  ngOnInit() {
    console.log("---------------------------");
    console.log("Board component initialized");
    this.load_game();

    console.log("TODO INICIADO: Username: ", this.username);
    console.log("TODO INICIADO: Game id: ", this.game_id);
    // Se activa el socket on para saber cuando es nuestro turno

    this.socketService.socketOnTurno()
    .subscribe({
      next: (jugador) => {
        console.log("TODO INICIADO: Turno: ", jugador);
        this.current_player = jugador;
        // If it's my turn, play
        if (this.current_player == this.player[0]){
          this.play();
        }
        // If it's not my turn, wait
        else{
          this.message = this.current_player + " está jugando su turno";
        }
      }
     });

     this.socketService.infoPartida()
      .subscribe({
        next: (info) => {
          console.log("TODO INICIADO: Info: ", info);
          this.actualize_game_info(info);
          this.show_position_every_players();
        }
      });

    if (this.current_player == this.player[0]){
      this.play();
    }
    else {
      this.cancelTimer();
      this.message = this.current_player + " está jugando su turno";
    }
  }

  ngOnDestroy() {
    // Destroy the intervals for safety
    if (this.interval_play != undefined){
      this.interval_play.unsubscribe();
    }
    if (this.dices_interval != undefined){
      this.dices_interval.unsubscribe();
    }
  }

  reStartTimerExpulsarJugador(){
    this.startTimer("expulsar_jugador", 90);
  }

  reStartTimerExpulsarJugadorAlert(){
    this.startTimer("expulsar_jugador", 15);
  }

  load_game(){
    // Print message
    this.message = "Cargando la partida...";
    console.log("Loading game...");
    // Avoid click on buttons
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    document.getElementById("button-end-turn")!.setAttribute("disabled", "true");
    // Get the game id from the url
    this.game_id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.username = this.socketService.username;
    // Get the list of players
    this.list_players = this.socketService.list_players;
    // Current player is the first player in the list
    this.current_player = this.list_players[0];
    console.log("TODO INICIADO: List players: ", this.list_players);
    // Initialization of players
    if(this.list_players.length != 0){
      for(let i = 0; i < this.list_players.length; i++){
        // Information of other players
        if (this.list_players[i] != this.username) {
          this.other_players_list.push([this.list_players[i], this.socketService.dineroPartida, {h: 10, v: 10}]);
        }
        // Information of myself
        else {
          this.player[0] = this.username;
          this.player[1] = this.socketService.dineroPartida;
        }
      }
    }

    //TODO <- ontener el nombre del usuario actual
    // TODO ----------------> revisar si hay que hacer esto o se va a buggear
    // this.socketService.consultarUsernameString(); <------------------------------------ FALTA OBTENER EL NOMMBRE DEL USUARIO ACTUAL
    console.log("TODO INICIADO: Username: ", this.player[0]);
    // Se muestra la posición inicial de todos los jugadores en el tablero
     this.show_position_every_players();
     console.log("jugador0", this.current_player);

  }

  /* === FUNCTIONS TO GET THE PROPERTIES OF THE PLAYERS === */

  get_properties(){
    console.log("Get properties of client player");
    // Get every properties of the player if he is not bankrupt
    if (!this.is_bankrupt) {
      console.log("Get properties of client player-2");
      this.socketService.listaAsignaturasC()
      .subscribe({
        next: (data: PropertyBoughtResponse[]) => {
          console.log("Get properties of client player realized successfully");
          let properties: [string, Coordenadas][] = [];
          for (let i = 0; i < data.length; i++) {
            properties.push([data[i].nombre, data[i].coordenadas]);
          }
          this.player_properties = properties;
        }
      });
    }
  }

  get_properties_of_other_players(): void {
    // Get every properties of the other players
    console.log("Get properties of other players");
    for (let player of this.other_players_list) {
      this.socketService.listaAsignaturasC()
      .subscribe({
        next: (data: PropertyBoughtResponse[]) => {
          let properties: [string, Coordenadas][] = [];
          for (let i = 0; i < data.length; i++) {
            properties.push([data[i].nombre, data[i].coordenadas]);
          }
          this.other_player_properties[player[0]] = properties;
        }
      });
    }
  }

    /* === FUNCTIONS TO PLAY === */

  async play(): Promise<void> {
    console.log("=== PLAY ===");
    this.reStartTimerExpulsarJugador();
    this.is_playing = true;
    this.message = this.current_player + ", es tu turno";
    console.log("ESTÁ JUGANDO");
    // Chequeamos si está en la cárcel
    this.socketService.estaJulio()
    .subscribe({
      next: (msg: any) => {
        console.log("ESTÁ EN LA CÁRCEL: ", msg);
        if(msg.carcel == true){
          console.log("ESTÁ EN LA CÁRCEL- 2");
          this.is_in_jail = true;
          let carta_carcel_tengo = false;
          if(msg.carta != null){
            carta_carcel_tengo = true;
          }
          this.createJailCardComponent(carta_carcel_tengo, msg.salirJulio);
        } else {
          /// TODO: Check if is in jail and either roll dices or direct card action of jail
          document.getElementById("tirar-dados")!.removeAttribute("disabled");
  
        }
      }
    });

  }

  play_turn_player() {
    console.log("=== PLAY TURN ===");
    // Cancel the timer
    // Disable play button to avoid double click
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    // Function to play the turn of a player
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
        this.player[2] = msg.coordenadas;
        this.show_position_every_players();
        this.reStartTimerExpulsarJugador();
    },
    error: async () => {
      // Try again
      this.play_turn_player();
    },
    complete: async () => {
      // Close button to avoid end turn
      document.getElementById("button-end-turn")!.setAttribute("disabled", "true");
      // Update message
      if (this.dices[0] === this.dices[1]){
        this.message = this.player[0] + ", has sacado dobles " + this.dices[0];
        this.nb_doubles += 1;
      }
      else {
        this.message = this.player[0] + ", has sacado " + this.dices[0] + " y " + this.dices[1];
      }
      // Action of the card
      this.card_action();
    }
    });
  }

  async card_action() {
    console.log("=== CARD ACTION ===");
    // Get card information
    this.socketService.casilla({coordenadas: {h: this.player[2].h, v: this.player[2].v}, socketId: this.socketService.socketID})
    .subscribe({
      next: async (msg: number) => {
        //console.log
        console.log("Position : " + this.player[2].h + " " + this.player[2].v);
        // Get the number of ack code
        let number = msg;

        // Get position with id
        let position_id = this.convert_position_to_id(this.player[2]);
        console.log("Position id: " + position_id);
        // Wait 0.5 seconds
        await this.sleep(500);
        // Check where is the player and special actions linked to the position
        if (this.nothing_cards.includes(position_id)) {
          this.message = "No pasa nada";
          // End turn
          this.end_turn();
        }
        else if (this.chance_cards.includes(position_id)) {
          // Wait 0.5 seconds
          await this.sleep(500);
          this.message = "Toma una carta de suerte";
          this.createChanceCardComponent();
        }
        else if (this.community_cards.includes(position_id)) {
          // Wait 0.5 seconds
          await this.sleep(500);
          this.message = "Toma una carta de comunidad";
          this.createCommunityCardComponent();
        }
        else if (this.taxes_cards.includes(position_id)) {
          this.message = "Tienes que pagar...";
          if (position_id == 38) {
            this.createInfoCardComponent("SEGURO ESCOLAR", "Tienes que pagar el seguro escolar : 133€", "Pagar 133€");
          }
          else if (position_id == 4) {
            this.createInfoCardComponent("APERTURA DE EXPEDIENTE", "Tienes que pagar la apertura de expediente : 267€", "Pagar 267€");
          }
        }
        // If it's a normal card, check if it's owned and what to do
        else {
          // If has to pay another player
          if (number == 2){
            this.createCardComponent(this.player[2].v, this.player[2].h, "Tienes que pagar", this.dices[0] == this.dices[1], "pay");
          }
          // If owner is the player and can increase the number of credit
          else if (number == 6) {
            this.createCardComponent(this.player[2].v, this.player[2].h, "Posees la casilla", this.dices[0] == this.dices[1], "increase");
          }
          // If can't increase the number of credit, propose to sell the card
          else if (number == 7) {
            this.createCardComponent(this.player[2].v, this.player[2].h, "Posees la casilla", this.dices[0] == this.dices[1], "sell");
          }
          // If no owner and can buy
          else if (number == 8) {
            // Display buy card
            this.createCardComponent(this.player[2].v, this.player[2].h, "Quieres comprar ?", this.dices[0] == this.dices[1], "buy");
          }
          // If no owner and can't buy, just show card
          else if (number == 9) {
            this.createCardComponent(this.player[2].v, this.player[2].h, "No puedes comprar", this.dices[0] == this.dices[1], "view");
          }
        }
      }
    });
  }

  end_turn(): void {
    console.log("===END TURN===");
    // Delete the pop-up-card component
    this.delete_pop_up_component();
    // Get old position of player
    let old_position_player = this.player[2];
    console.log("old position player (h,v): " + old_position_player.h + " " + old_position_player.v);
    /// TODO: Get new position of player by updating game information
    if (this.dices[0] == this.dices[1] && this.nb_doubles < 3) {
      this.message = "Vuelve a tirar los dados";
      document.getElementById("tirar-dados")!.removeAttribute("disabled");
      document.getElementById("button-end-turn")!.setAttribute("disabled", "true");
    }
    else if (this.dices[0] == this.dices[1] && this.nb_doubles == 3) {
      this.message = "Vas a la cárcel";
      this.is_in_jail = true;
      this.nb_doubles = 0;
      this.player[2] = {h: 0, v: 10};
      this.message = "Pulsa el botón para terminar tu turno";
      document.getElementById("button-end-turn")!.removeAttribute("disabled");
    }
    else {
      this.message = "Pulsa el botón para terminar tu turno";
      document.getElementById("button-end-turn")!.removeAttribute("disabled");
    }
  }

  go_next_turn() : void {
    console.log("===GO NEXT TURN===");
    // Start timer to trigger next turn
    this.reStartTimerExpulsarJugador();
    // Indicate to backend that the player has finished his turn
    this.message = "Has terminado tu turno";
    // Disable button to end turn
    document.getElementById("button-end-turn")!.setAttribute("disabled", "true");
    this.is_playing = false;
    this.nb_doubles = 0;
    // Indicate to backend that the player has finished his turn
    this.socketService.siguienteTurno()
    .then((nextPlayer: any) => {
      console.log("Next turn : ", nextPlayer);
      this.current_player = nextPlayer.jugador;
      this.message = "Es el turno de " + this.current_player;
    });
  }

  /* === FUNCTIONS TO UPDATE INFORMATION === */

  actualize_game_info(data : Partida): void {
    let listaJugadores = data.nombreJugadores;
    let listaDineros = data.dineroJugadores;
    let listaPosiciones = data.posicionJugadores;
    // Result table with other players
    let result : [string, number, Coordenadas][] = [];
    for (let i = 0; i < listaJugadores.length; i++) {
      if (listaJugadores[i] !== this.player[0]) {
        // Get information of other players
        let jugador = listaJugadores[i];
        let dinero = listaDineros[i];
        let posicion = listaPosiciones[i];
        // Add to other_players_list if no error
        if (jugador != null && dinero != null && posicion != null){
          result.push([jugador, dinero, posicion]);
        }
      }
      // Info of client player
      else {
        this.player[1] = listaDineros[i];
        this.player[2] = listaPosiciones[i];
      }
      this.other_players_list = result;
    }
    // If user not in list, it's because he is bankrupt
    if (!listaJugadores.includes(this.player[0])) {
      this.is_bankrupt = true;
    }
  }

  update_player_info(): void {
    // Get information of player
    console.log("===UPDATE PLAYER INFO===");
    this.get_properties();
    /*
    this.socketService.infoPartida()
    .subscribe({
      next: (data: Partida) => {
        console.log("===UPDATE PLAYER INFO===");
        this.actualize_game_info(data);
        this.get_properties();
      },
      error: (error) => {
        // Try again
        this.update_player_info();
      }
    });*/
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

  /* === FUNCTIONS TO MANAGE THE POSITION OF THE PLAYER === */

  convert_position_to_id(coord : Coordenadas): number{
    // Function to convert position (v, h) to number between 0 and 39
    let v = coord.v;
    let h = coord.h;
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

  show_position_every_players(): void {
    console.log("=== POSITION OF PLAYERS ACTUALIZED ===");
    // Show position of the player if he is not bankrupt
    if (!this.is_bankrupt) {
      this.show_position(this.player[0], this.player[2], 0);
    }
    // Show position of the other players
    for (let i = 0; i < this.other_players_list.length; i++) {
      this.show_position(this.other_players_list[i][0], this.other_players_list[i][2], i + 1);
    }
  }

  add_position(id_player: string, id_property: number, index_color: number): void{
    // Function to display position (x, y) in the board
    // Get the property of the element with id = position
    // If the position is 30, it's the go to jail position, so we put it in 10
    if (id_property  == 30) id_property = 10;
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

  show_position(id_player: string, position: Coordenadas, index_color: number): void{
    // Function to display position of id_player in the board
    // Get the id of property with position
    let property_id = this.convert_position_to_id(position);
    this.remove_position(id_player);
    this.add_position(id_player, property_id, index_color);
  }

  /* === FUNCTIONS TO DISPLAY POP UP COMPONENTS === */

  createAlertComponent(): void {
    // Assure to delete the old buy card component
    this.delete_pop_up_component();
    this.cancelTimer();

    const factory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs

    componentRef.instance.leave_game.subscribe(() => {this.leave_game()});
    componentRef.instance.close_card.subscribe(() => {this.delete_pop_up_component()});
    componentRef.instance.reStartTimerExpulsarJugador.subscribe(() => {this.reStartTimerExpulsarJugador()});
    componentRef.instance.reStartTimerExpulsarJugadorAlert.subscribe(() => {this.reStartTimerExpulsarJugadorAlert()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createCardComponent(v: number, h: number, message: string, play_again: boolean = false, type: string, money_to_pay: number=0, trigger_end_turn: boolean = true): void {
    // Assure to delete the old buy card component
    this.delete_pop_up_component();
    this.reStartTimerExpulsarJugador();
    const factory = this.componentFactoryResolver.resolveComponentFactory(InteractionCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.h = h;
    componentRef.instance.v = v;
    componentRef.instance.game_id = this.game_id;
    componentRef.instance.username = this.player[0];
    componentRef.instance.message = message;
    componentRef.instance.play_again = play_again;
    componentRef.instance.amount_to_pay = money_to_pay;
    componentRef.instance.type = type;
    componentRef.instance.trigger_end_turn = trigger_end_turn;
    componentRef.instance.is_playing = this.is_playing;
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    componentRef.instance.close_card.subscribe(() => {this.delete_pop_up_component()});
    componentRef.instance.update_player_info.subscribe(() => {this.update_player_info()});
    componentRef.instance.reStartTimerExpulsarJugador.subscribe(() => {this.reStartTimerExpulsarJugador()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createChanceCardComponent(): void {
    // Assure to delete the old buy card component
    this.delete_pop_up_component();
    this.reStartTimerExpulsarJugador();
    const factory = this.componentFactoryResolver.resolveComponentFactory(ChanceCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.idPartida = this.game_id;
    componentRef.instance.username = this.player[0];
    componentRef.instance.coordenadas = this.player[2];
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    //componentRef.instance.reStartTimerExpulsarJugador.subscribe(() => {this.reStartTimerExpulsarJugador()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createCommunityCardComponent(): void {
    // Assure to delete the old pop up card component
    this.delete_pop_up_component();
    this.reStartTimerExpulsarJugador();
    const factory = this.componentFactoryResolver.resolveComponentFactory(CommunityCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.idPartida = this.game_id;
    componentRef.instance.username = this.player[0];
    componentRef.instance.coordenadas = this.player[2];
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    //componentRef.instance.reStartTimerExpulsarJugador.subscribe(() => {this.reStartTimerExpulsarJugador()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createInfoCardComponent(title : string, description: string, button_text : string, trigger_end_turn: boolean = true): void {
    // Assure to delete the old pop up card component
    this.delete_pop_up_component();
    this.reStartTimerExpulsarJugador();
    const factory = this.componentFactoryResolver.resolveComponentFactory(InfoCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.title = title;
    componentRef.instance.description = description;
    componentRef.instance.button_message = button_text;
    componentRef.instance.trigger_end_turn = trigger_end_turn;
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    componentRef.instance.delete_card.subscribe(() => {this.delete_pop_up_component()});
    componentRef.instance.reStartTimerExpulsarJugador.subscribe(() => {this.reStartTimerExpulsarJugador()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createJailCardComponent(tengo_carta_salir: boolean, puedoPagar: boolean): void {
    // Assure to delete the old pup up card component
    this.delete_pop_up_component();
    this.reStartTimerExpulsarJugador();
    const factory = this.componentFactoryResolver.resolveComponentFactory(JailCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.has_card = tengo_carta_salir;
    componentRef.instance.can_pay = puedoPagar;
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    componentRef.instance.reStartTimerExpulsarJugador.subscribe(() => {this.reStartTimerExpulsarJugador()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createSubastaCardComponent(coord: Coordenadas): void {
    // Assure to delete the old pup up card component
    this.delete_pop_up_component();
    const factory = this.componentFactoryResolver.resolveComponentFactory(SubastaCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.game_id = this.game_id;
    componentRef.instance.h = coord.h;
    componentRef.instance.v = coord.v;
    componentRef.instance.message = "Subasta";
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

  delete_pop_up_component() {
    // Assure to delete the old pup up card component
    const old_pop_up_component_element = document.getElementById('pop-up-card');
    if (old_pop_up_component_element != null){
      old_pop_up_component_element.remove();
    }
  }

  /* === FUNCTIONS TO KNOW THE TYPE OF A PROPERTY === */
  get_type_casilla(coord: Coordenadas) {
    if (coord.h == 5 || coord.v == 5){
      return "party";
    }
    else if (coord.h == 0 && coord.v == 8){
      return "electricity"
    }
    else if (coord.h == 8 && coord.v == 0){
      return "heat";
    }
    else{
      return "propriety";
    }
  }

  get_color_property(coord: Coordenadas){
    // Return [color_background, color_text]
    let id_position = this.convert_position_to_id(coord);
    if (this.get_type_casilla(coord) == 'propriety'){
      if (id_position < 5){
        return ["#b02f7c", "#ffffff"];
      }
      else if (id_position < 10){
        return ["#5e3577", "#CCCCCC"];
      }
      else if (id_position < 15){
        return ["#5a6dba", "#ffffff"];
      }
      else if (id_position < 20){
        return ["#d2eaf5", "#000000"];
      }
      else if (id_position < 25){
        return ["#41994e", "#f0f0f0"];
      }
      else if (id_position < 30){
        return ["#ffed20", "#000000"];
      }
      else if (id_position < 35){
        return ["#fa811d", "#ffffff"];
      }
      else {
        return ["#f50c2b", "#ffffff"];
      }
    }
    else {
      return ["#fafaf8", "#000000"];
    }
  }

  /* === FUNCTIONS DEL TIMER === */
  startTimer(action: string, time_limit_1: number) {
    console.log("=== START TIMER ===");
    // If no active timer, create one
    if (!this.is_timer_active) {
      // Set timer as active
      this.is_timer_active = true;
      this.remaining_time = time_limit_1;
      // Time limit in seconds
      const time_limit = time_limit_1;
      // calculate the turn end time in milliseconds
      const end_time = Date.now() + time_limit * 1000;
      this.timer = setInterval(() => {
        // Calculate remaining time in seconds
        this.remaining_time = Math.floor((end_time - Date.now()) / 1000);
        // Check if the turn hasn't already ended
        if (this.remaining_time <= 0) {
          console.log("90 SECONDS WAITED");
          if (action == "next_turn") {
            // Go to next turn
            this.cancelTimer();
            this.go_next_turn();

          } else if (action == "leave_game") {
            // Clear interval
            clearInterval(this.timer);
            // Leave the game
            this.leave_game();
          } else if ( action == "expulsar_jugador"){
            console.log("=== EXPULSAR JUGADOR ===");
            //TODO <-- Expulsar jugador
            this.cancelTimer();
            this.createAlertComponent();

          }
        }
      }, 1000);
    }
    else {
      // Delete old timer and create a new one
      this.cancelTimer();
      this.startTimer(action, time_limit_1);
    }
  }




  cancelTimer() {
    console.log("=== CANCEL TIMER ===");
    // Set timer as inactive
    this.is_timer_active = false;
    clearInterval(this.timer);
  }

  /* === FUNCTIONS TO LEAVE THE GAME === */
  leave_game(){
    // Declare bankruptcy to backend
    this.socketService.siguienteTurno()
    .then((data: any) => {
      console.log("=== LEAVE GAME SIGUIENTE JUGADOR ===");
    });

    this.socketService.bancarrota()
    .subscribe({
      next: (data: any) => {
        console.log("=== LEAVE GAME ===");
        // Update player money to 0
        //TODO: revisar como se quita al usuario, si es cosa del back o del front
      },
      complete: () => {
        // Redirect to home page of player
        if(this.socketService.soyInvitado){
          this.router.navigate(['/pantalla_invitado']);
        } else {
          this.router.navigate(['/pantalla']);
        }
      }
    });
  }
}
