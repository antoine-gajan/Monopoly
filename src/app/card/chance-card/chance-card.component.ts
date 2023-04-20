import { Component } from '@angular/core';
import {Chance} from "../chance";

@Component({
  selector: 'app-chance-card',
  templateUrl: './chance-card.component.html',
  styleUrls: ['./chance-card.component.css']
})
export class ChanceCardComponent {
  chance: Chance;
}
