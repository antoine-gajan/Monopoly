import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  dices: Number[] = [];
  position_player: Number = 0;
  current_player: Number = 0;

  play(): void{
    this.play_turn_player(this.current_player);
  }

  play_turn_player(id_player: Number): void{
    // Function to play the turn of a player
    // Roll dices
    this.roll_dices();
    // Update player position
    this.update_position(this.current_player, this.position_player, this.dices);
    /// TODO : Verify is the player can buy the property and ask to buy it
    /// TODO : If dices is double, play again
    if (this.dices[0] == this.dices[1]) {
      this.play_turn_player(this.current_player);
    }
    else{
      // Next player
      //this.current_player = +this.current_player + 1;
    }
  }
  roll_dices(): void{
    // Function to roll dices
    let dices: Number[] = [];
    for (let i = 0; i < 2; i++) {
      dices.push(Math.floor(Math.random() * 6) + 1);
    }
    this.dices = dices;
    // Display for degugging
    console.table(this.dices)
  }

  get_image_from_dice_value(value: Number): String{
    // Function to get the image path from the dice value
    return "../../../assets/images/dice/" + value + ".png";
  }

  convert_position_to_number(x: Number, y: Number): Number{
    // Function to convert position (x, y) to number between 0 and 39
    if (x == 10 && y == 10) {
      return 0;
    }
    else if (x == 0){
      return +20 + +y;
    }
    else if (x == 10){
      return +10 - +y;
    }
    else if (y == 0){
      return 20 - +x;
    }
    else if (y == 10){
      return +30 + +x;
    }
    else{
      console.log("Error: x and y are not valid");
      return 0;
    }
  }

  add_position(id_player : Number, id_property : Number): void{
    // Function to display position (x, y) in the board
    // Get the property of the element with id = position
    let property = document.getElementById(id_property.toString());
    if (property != null){
      let container_property = property.getElementsByClassName("container")[0];
      /// TODO : Add player's image in the center of the property
      // Add a circle on the property
      let player : HTMLElement = document.createElement("div");
      player.id = "player" + id_player.toString();
      player.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: red; border-radius: 50%; width: 20px; height: 20px;";
      container_property.appendChild(player);
    }
    else{
      console.log("Error: position is not valid");
    }
  }

  remove_position(id_player : Number, id_property : Number): void{
    /// TODO : Remove previous position of player
    // Get the div with circle id = id_player
    let player = document.getElementById("player" + id_player.toString());
    // Remove the div
    if (player != null){
      player.remove();
    }
  }
  update_position(id_player : Number, old_position : Number, dices : Number[]){
    // Function to update the position of a player
    // Update position attribute
    this.position_player = (+this.position_player + +dices[0] + +dices[1]) % 40;
    // Remove previous position
    this.remove_position(id_player, old_position);
    // Display new position
    this.add_position(id_player, this.position_player);
  }
}
