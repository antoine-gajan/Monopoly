import {Component, Input, OnInit} from '@angular/core';
import {Party} from "../party";

@Component({
  selector: 'app-party-card',
  templateUrl: './party-card.component.html',
  styleUrls: ['./party-card.component.css']
})
export class PartyCardComponent implements OnInit{
  @Input() h: number = 5;
  @Input() v: number = 10;
  party: Party;
  constructor() {

  }

  ngOnInit() {

  }
}
