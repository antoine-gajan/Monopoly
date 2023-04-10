import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  dices: Number[] = [];
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
    // Function to convert position (x, y) to number between 1 and 39
    if (x == 0){
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

  display_position(x: Number, y: Number): void{
    // Function to display position (x, y) in the board
    let position = this.convert_position_to_number(x, y);
    // Get the property of the element with id = position
    let position_element = document.getElementById(position.toString());
    if (position_element != null){
      /// TODO : Add player's image in the center of the property
    }
    else{
      console.log("Error: position is not valid");
    }
  }
}
