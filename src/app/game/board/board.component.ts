import {Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {GameService} from "../game.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../user/user.service";
import {InteractionCardComponent} from "../../card/interaction-card/interaction-card.component";
import {ChanceCardComponent} from "../../card/chance-card/chance-card.component";
import {CommunityCardComponent} from "../../card/community-card/community-card.component";
import {EMPTY, forkJoin, interval, switchMap, takeWhile} from "rxjs";
import {InfoCardComponent} from "../../card/info-card/info-card.component";
import {JailCardComponent} from "../../card/jail-card/jail-card.component";
import {Coordenadas, PlayerListResponse, PropertiesBoughtResponse} from "../response-type";
import {DevolutionPropertiesFormComponent} from "../devolution-properties-form/devolution-properties-form.component";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  username: string;
  // Game variables
  game_id : number;
  dices: number[] = [];
  current_player: string;

  // Relative to client player
  list_players: string[] = [];
  player: [string, number, Coordenadas] = ["", 0, {h: 10, v: 10}];
  playerArray: [PlayerListResponse] = [{} as PlayerListResponse];
  nb_doubles: number = 0;
  is_playing: boolean = false;
  is_in_jail: boolean = false;
  is_bankrupt: boolean = false;
  player_properties: [string, Coordenadas][] = [];
  timer: any;
  is_timer_active: boolean = false;
  remaining_time: number = 0;

  // Variables for the game functionning
  message: string;
  interval_play: any;
  dices_interval: any;

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

  constructor(
    private gameService: GameService,
    //private userService: UserService, 
    private route: ActivatedRoute,
    private router: Router, 
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef, 
    private elRef: ElementRef,
    private socketService: WebSocketService
  ) { }

  /* === FUNCTIONS TO INITIALIZE AND DESTROY THE GAME === */
  ngOnInit() {

    // Se activa el socket on para saber cuando es nuestro turno
    this.socketService.socketOnTurno();
    console.log("---------------------------");
    console.log("Board component initialized");
    console.log("TODO INICIADO: Game id: ", this.game_id);
    // Se obtiene la lista de jugadores
    this.list_players = this.socketService.list_players;
    console.log("TODO INICIADO: List players: ", this.list_players);
    if(this.list_players.length != 0){
      this.player[0] = this.list_players[0];// TODO <---------------------actualizar essto y cambiarlo cuando nos devuelban bien los jugadore sy datos de la aprtida
      this.player[1] = 1500; 
      for(let i = 1; i<this.list_players.length; i++){
        this.other_players_list.push([this.list_players[i], 1500, {h: 10, v: 10}]);
      }
    }
    //TODO <-------------------------------------------------------FALTA COMRPOBAR QUE CARGUEN LOS USUARIOS
    /* TODO: revisar implementación de git */

    this.message = "Cargando la partida..."
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    document.getElementById("button-end-turn")!.setAttribute("disabled", "true");
    //TODO <- ontener el nombre del usuario actual
    // TODO ----------------> revisar si hay que hacer esto o se va a buggear
    // this.socketService.consultarUsernameString(); <------------------------------------ FALTA OBTENER EL NOMMBRE DEL USUARIO ACTUAL
    console.log("TODO INICIADO: Username: ", this.player[0]);
    // Se muestra la posición inicial de todos los jugadores en el tablero
    this.show_position_every_players();
    
    this.socketService.siguienteTurno()
    .then((nextPlayer: any) => {
      console.log("Next player: ", nextPlayer.jugador);
      console.log("Username: ",this.socketService.username);
      if(nextPlayer.jugador == this.socketService.username){
        this.is_playing = true;
        console.log("ESTÁ JUGANDO");
        this.play_turno();
      } else {
        console.log("NO ESTÁ JUGANDO");
        this.ver_jugar();

      }
    });
  }



// <--------------------------------------------------------------------------REVISAR A PARTIR DE AQUÍ

  ngOnDestroy() {
    // Destroy the intervals for safety
    if (this.interval_play != undefined){
      this.interval_play.unsubscribe();
    }
    if (this.dices_interval != undefined){
      this.dices_interval.unsubscribe();
    }
  }


  
  async lanzarDados(){
    // Si no es tu turno, sale un aviso al intentar lanzar los dados
    if(this.current_player != this.socketService.username){
      alert("¡No es tu turno de lanzar los dados! Le toca a "+this.current_player);
      return;
    }
    this.startTimer("Lanzar_dados");
    console.log("Se va a lanzar los dados");
    this.socketService.lanzarDados()
    .then((msg: any) => {
      console.log("DADOS LANZADOS: ", msg);
      clearInterval(this.dices_interval);
      this.dices[0] = msg.dado1;
      this.dices[1] = msg.dado2;
    })
    .catch(() => {
      console.log("ERROR AL LANZAR DADOS");
    });

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
      console.log("=== UPDATE PLAYER POSITION ===");
      // Update player position
      await this.update_local_player_position(this.dices);
      // Action of the card
      this.card_action();


    }

  }



  obtenerNombreUsuario(){
    this.socketService.consultarUsername()
    .then((nombreUsuario: string) => {
      console.log("nombreUser: ", nombreUsuario);
      this.username = nombreUsuario;
      //this.socketService.setUsername(nombreUsuario);
    })
    .catch(() => {
      console.log("ERROR AL OBTENER USERNAME");
    });
  }

  /* === FUNCTIONS TO GET THE PROPERTIES OF THE PLAYERS === */
  get_properties(): void { // -------------------- actualizada con sockets
    // Get every properties of the player if he is not bankrupt
    if (!this.is_bankrupt) {
      this.socketService.listaAsignaturasC({socketId: this.socketService.socketID})
      .then((listadoAsignaturasCompradas: any) => {
        console.log("LISTA DE ASIGNATURAS COMPRADAS", listadoAsignaturasCompradas);
        let properties: [string, Coordenadas][] = [];
        for (let i = 0; i < listadoAsignaturasCompradas.length; i++) {
          properties.push([listadoAsignaturasCompradas[i].nombre, listadoAsignaturasCompradas[i].coordenadas]);
        }
        this.player_properties = properties;
      })
      .catch((error) => {
        //console.log("ERROR AL OBTENER LA LISTA DE ASIGNATURAS COMPRADAS");
        console.log(error);
        // Try again
        this.get_properties();
      });
    }
  }

  get_properties_of_other_players(): void {
    // Get every properties of the other players
    console.log("Get properties of other players");
    for (let player of this.other_players_list) {
      this.socketService.listaAsignaturasC({socketId: this.socketService.socketID})
      .then((listadoAsignaturasCompradas: any) => {
        console.log("LISTA DE ASIGNATURAS COMPRADAS", listadoAsignaturasCompradas);
      });

      /*this.gameService.get_all_properties_of_player(this.game_id, player[0]).subscribe({
        next: (data: PropertiesBoughtResponse) => {
          let properties: [string, Coordenadas][] = [];
          for (let i = 0; i < data.casillas.length; i++) {
            properties.push([data.casillas[i].nombre, data.casillas[i].coordenadas]);
          }
          this.other_player_properties[player[0]] = properties;
        }
      });*/
    }
  }

  async play_turno(){

    this.current_player = this.socketService.username;
    this.interval_play = interval(3000);
    if (this.other_players_list.length === 0) {
      this.message = "¡Has ganado!";
      // Create a info card component
      this.createInfoCardComponent("¡Felicitaciones!", "Has ganado la partida", "Genial", false);
    } else {
      this.is_playing = true;
      this.is_in_jail = false;
      this.message = this.socketService.username + ", es tu turno";
      this.current_player = this.socketService.username;

      
      document.getElementById("tirar-dados")!.removeAttribute("disabled");
      // Start timer
      this.startTimer("leave_game");  
    }
    return EMPTY;
  } 

  async ver_jugar(){
    this.message = this.current_player + " está jugando su turno";
    return this.gameService.get_list_players(this.game_id);
  }
  
  /* === FUNCTIONS TO PLAY === */
  async play(): Promise<void> {
    // Ensure to execute the interval only once
    this.current_player = "";
    // Check if the player can play or not every 2 seconds
    this.interval_play = interval(3000)
      .pipe(
        // Take while the current player is not the current user's player
        takeWhile(() => this.current_player !== this.player[0]),
        switchMap(() => this.gameService.get_current_player(this.game_id)),
        switchMap((playerResponse) => {
          this.current_player = playerResponse.jugador;
      if (this.current_player === this.player[0]) {
        // Check if the player has win the game (only player in the game)
        if (this.other_players_list.length === 0) {
          this.message = "¡Has ganado!";
          // Create a info card component
          this.createInfoCardComponent("¡Felicitaciones!", "Has ganado la partida", "Genial", false);
        }
        // If there are other players, play his turn
        else {
          // When he can play, activate button and remove is_in_jail for safety
          this.is_playing = true;
          this.is_in_jail = false;
          this.message = this.player[0] + ", es tu turno";
          document.getElementById("tirar-dados")!.removeAttribute("disabled");
          // Start timer
          this.startTimer("leave_game");
        }
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
    next : async (data: PlayerListResponse) => {
      this.actualize_game_info(data);
      this.get_properties();
      this.get_properties_of_other_players();
      // Show position of the players
      this.show_position_every_players();
      // If there is only one player, display the winner
      if (data.listaJugadores.length === 1) {
        if (data.listaJugadores[0] === this.player[0]) {
          this.message = "¡Has ganado!";
          // Create a info card component
          this.createInfoCardComponent("¡Felicitaciones!", "Has ganado la partida", "Genial", false);
        }
        else {
          this.message = "El ganador es " + data.listaJugadores[0];
          // Create a info card component
          this.createInfoCardComponent("¡Lo sentimos!", "El ganador es " + data.listaJugadores[0], "Vaya", false);
        }
        // Wait 10 seconds
        await this.sleep(10000);
        // Stop the interval
        this.interval_play.unsubscribe();
        this.message = "Redirigiendo a la página principal en 30 segundos...";
        // Redirect to home page automatically in 30 seconds
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 30000);
      }
    },
    error: (error) => {
      // Try again
      this.interval_play.unsubscribe();
      this.play();
    }
    });
  }

  play_turn_player() {
    console.log("=== PLAY TURN ===");
    // Cancel the timer
    this.cancelTimer();
    // Disable play button to avoid double click
    document.getElementById("tirar-dados")!.setAttribute("disabled", "true");
    // Function to play the turn of a player
    // Roll dices
    this.move_dices_action();
    this.socketService.lanzarDados()
    .then((msg: any) => {
      console.log("DADOS LANZADOS: ", msg);
      clearInterval(this.dices_interval);
      this.dices[0] = msg.dado1;
      this.dices[1] = msg.dado2;
      // Update player position
      return this.update_local_player_position(this.dices);
    })
    .then(() => {
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
      console.log("=== UPDATE PLAYER POSITION ===");
      // Action of the card
      this.card_action();
    })
    .catch(() => {
      console.log("ERROR AL LANZAR DADOS");
    });
  }
  

  async card_action() {
    console.log("=== CARD ACTION ===");
    // Get card information
    let owner_of_card: string | null = null;
    let money_to_pay: number | null = null;
    let increase_credit_possible: boolean = false;
    
    console.log("=== GET CARD INFO ===", this.player[2].h, this.player[2].v);
    // TODO <---------------------------------------------------------------------------------infoAsignatura
    if((this.player[2].h == 3 && this.player[2].v == 10)
      || (this.player[2].h == 3 && this.player[2].v == 10)
    ){ // Casilla de suerte
      this.socketService.suerte()
      .then((msg: any) => {
        console.log("SUERTE: ", msg); //TODO <- obtener casilla de suerte
        this.createChanceCardComponent();
      });
    }
    this.socketService.casilla({coordenadas: {h: this.player[2].h, v: this.player[2].v}, socketId: this.socketService.socketID})
    .then((cod: any) => {
      console.log("¿puedo comprar casilla?", cod);
      if(cod == 8){
        console.log("puedes comprar");
        this.createCardComponent(this.player[2].v, this.player[2].h, "Quieres comprar ?", this.dices[0] == this.dices[1], "buy");
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
    // Get new position of player by updating game information
    this.socketService.siguienteTurno()
    .then((msg: any) => {
      //this.actualize_game_info(msg);
      console.log("new position player : " + this.player[2]);
      console.log("SIGUIENTE TURNO");
    });
    
   
  }

  go_next_turn() : void {
    console.log("===GO NEXT TURN===");
    // Indicate to backend that the player has finished his turn
    this.message = "Has terminado tu turno";
    // Disable button to end turn
    document.getElementById("button-end-turn")!.setAttribute("disabled", "true");
    this.is_playing = false;
    this.nb_doubles = 0;
    // Indicate to backend that the player has finished his turn
    
    this.socketService.siguienteTurno()
    .then ( (data: any) => {
      console.log("Siguiente turno", data);
      this.current_player = data.jugador;
      console.log("Next turn : " + this.current_player);
    })
    .catch( (error: any) => {
      this.go_next_turn();
    })
    .finally( () => {
      this.message = "Es el turno de " + this.current_player;
      // Go back to play to wait next time to play
      this.play();
    });
  }

    

  /* === FUNCTIONS TO UPDATE INFORMATION === */
  actualize_game_info(data : PlayerListResponse): void {
    let listaJugadores = data.listaJugadores;
    let listaDineros = data.listaDineros;
    let listaPosiciones = data.listaPosiciones;
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

  
  update_player_info(): void { // ---------------------------------------------------> TODO FALTA CAMBIAR A SOCKETS
    // Get information of player
    this.gameService.get_list_players(this.game_id).subscribe({
      next: (data: PlayerListResponse) => {
        console.log("===UPDATE PLAYER INFO===");
        this.actualize_game_info(data);
        this.get_properties();
      },
      error: (error) => {
        // Try again
        this.update_player_info();
      }
    });
  }

  // geera numeros aleatorios en los dados antes de obtener el valor de la consulta de tirar dados
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

  async update_local_player_position(dices: number[]) {
    console.log("===UPDATE LOCAL PLAYER POSITION===");
    // Get old position id
    let old_id = this.convert_position_to_id(this.player[2]);
    // Update position attribute
    let change_turn = old_id + dices[0] + dices[1] >= 40;
    // Get new position id
    let new_id = (old_id + dices[0] + dices[1]) % 40;
    // Get position from id
    let new_position = this.convert_id_to_position(new_id);
    // Update position
    this.player[2].v = new_position[0];
    this.player[2].h = new_position[1];
    // Check if is in jail
    this.is_in_jail = (new_id == 30) || this.nb_doubles == 3;
    // If change turn, receive 267
    if (change_turn){
      this.message = "Has pasado por la salida";
      this.player[1] += 267;
      // Wait 0.5 seconds
      await this.sleep(500);
    }
    // If player has to go to jail-card
    if (this.is_in_jail) {
      this.show_position(this.player[0], this.player[2], 0);
      // Message in function of the manner to go to jail
      if (this.nb_doubles == 3){
        this.message = "Has ido en julio por tirar 3 dobles";
      }
      else{
        this.message = "Has ido en julio";
      }
      // Wait 0.5 seconds
      await this.sleep(500);
      // Go to jail
      this.player[2].v = 10;
      this.player[2].h = 0;
    }
    // Show position
    this.show_position(this.player[0], this.player[2], 0);
    
  }

  show_position(id_player: string, position: Coordenadas, index_color: number): void{
    // Function to display position of id_player in the board
    // Get the id of property with position
    let property_id = this.convert_position_to_id(position);
    this.remove_position(id_player);
    this.add_position(id_player, property_id, index_color);
  }

  /* === FUNCTIONS TO DISPLAY POP UP COMPONENTS === */
  createCardComponent(v: number, h: number, message: string, play_again: boolean = false, type: string, money_to_pay: number=0, trigger_end_turn: boolean = true): void {
    // Assure to delete the old buy card component
    this.delete_pop_up_component();
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
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createChanceCardComponent(): void {
    // Assure to delete the old buy card component
    this.delete_pop_up_component();
    const factory = this.componentFactoryResolver.resolveComponentFactory(ChanceCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.idPartida = this.game_id;
    componentRef.instance.username = this.player[0];
    componentRef.instance.coordenadas = this.player[2];
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createCommunityCardComponent(): void {
    // Assure to delete the old pop up card component
    this.delete_pop_up_component();
    const factory = this.componentFactoryResolver.resolveComponentFactory(CommunityCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.idPartida = this.game_id;
    componentRef.instance.username = this.player[0];
    componentRef.instance.coordenadas = this.player[2];
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createInfoCardComponent(title : string, description: string, button_text : string, trigger_end_turn: boolean = true): void {
    // Assure to delete the old pop up card component
    this.delete_pop_up_component();
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
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createJailCardComponent(): void {
    // Assure to delete the old pup up card component
    this.delete_pop_up_component();
    const factory = this.componentFactoryResolver.resolveComponentFactory(JailCardComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.player_money = this.player[1];
    componentRef.instance.player_name = this.player[0];
    componentRef.instance.game_id = this.game_id;
    // Outputs
    componentRef.instance.end_turn.subscribe(() => {this.end_turn()});
    // Give an id to the component html
    componentRef.location.nativeElement.id = "pop-up-card";
    // Center the component at the middle of the page
    componentRef.location.nativeElement.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  }

  createDevolutionFormComponent(): void {
    // Assure to delete the old pup up card component
    this.delete_pop_up_component();
    const factory = this.componentFactoryResolver.resolveComponentFactory(DevolutionPropertiesFormComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    // Inputs
    componentRef.instance.idPartida = this.game_id;
    componentRef.instance.player_username = this.player[0];
    componentRef.instance.list_properties = this.player_properties;
    componentRef.instance.is_in_jail = this.is_in_jail;
    // Outputs
    if (!this.is_in_jail){
      // If not in jail, devolve button can call to end turn
      componentRef.instance.next_step.subscribe(() => {this.end_turn()});
    }
    else{
      // If in jail, next step will just close the pop up card
      componentRef.instance.next_step.subscribe(() => {this.delete_pop_up_component()});
    }
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
    let id_position = this.convert_position_to_id(coord);
    if (this.get_type_casilla(coord) == 'propriety'){
      if (id_position < 5){
        return "#b02f7c";
      }
      else if (id_position < 10){
        return "#5e3577";
      }
      else if (id_position < 15){
        return "#5a6dba";
      }
      else if (id_position < 20){
        return "#d2eaf5";
      }
      else if (id_position < 25){
        return "#41994e";
      }
      else if (id_position < 30){
        return "#ffed20";
      }
      else if (id_position < 35){
        return "#fa811d";
      }
      else {
        return "#f50c2b";
      }
    }
    else {
      return "#fafaf8";
    }
  }

  /* === FUNCTIONS DEL TIMER === */
  startTimer(action: string) {
    console.log("=== START TIMER ===");
    // If no active timer, create one
    if (!this.is_timer_active) {
      // Set timer as active
      this.is_timer_active = true;
      this.remaining_time = 90;
      // Time limit in seconds
      const time_limit = 90;
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
            // Leave the game
            alert("Se te acaba el tiempo, vas a estar desconectado del juego.")
            // Clear interval
            clearInterval(this.timer);
            // Leave the game
            this.leave_game();
          }
        }
      }, 1000);
    }
    else {
      // Delete old timer and create a new one
      this.cancelTimer();
      this.startTimer(action);
    }
  }

  cancelTimer() { 
    console.log("=== CANCEL TIMER ===");
    // Set timer as inactive
    this.is_timer_active = false;
    clearInterval(this.timer);
  }

  /* === FUNCTIONS TO LEAVE THE GAME === */
  leave_game(){ // -------------------- actualizada con sockets
    // Declare bankruptcy to backend
    this.socketService.bancarrota()
    .then((msg: any) => {
      console.log("ENTRA A DECLARAR BANCARROTA: ", msg);
      console.log("=== LEAVE GAME ===");
      // Update player money to 0
      this.player[1] = 0;
      this.router.navigate(['/']);
    })
    .catch(() => {
      console.log("ERROR AL DECLARAR BANCARROTA");
      this.leave_game();
    });
    /*this.gameService.declare_bankruptcy(this.player[0], this.game_id).subscribe({
      next: (data: any) => {
        console.log("=== LEAVE GAME ===");
        // Update player money to 0
        this.player[1] = 0;
      },
      error: (error) => {
        console.error(error);
        // Try again
        this.leave_game();
      },
      complete: () => {
        // Redirect to home page of player
        this.router.navigate(['/']);
      }
    });*/
  }
}
