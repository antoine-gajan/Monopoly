import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoardComponent} from "./board/board.component";
import {LeaderboardComponent} from "./leaderboard/leaderboard.component";



@NgModule({
  declarations: [
    BoardComponent,
    LeaderboardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class GameModule { }
