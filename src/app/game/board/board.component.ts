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
}
