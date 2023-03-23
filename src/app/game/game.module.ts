import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoardComponent} from "./board/board.component";
import {LeaderboardComponent} from "./leaderboard/leaderboard.component";
import { ProprietyCardComponent } from './propriety-card/propriety-card.component';



@NgModule({
  declarations: [
    BoardComponent,
    LeaderboardComponent,
    ProprietyCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
