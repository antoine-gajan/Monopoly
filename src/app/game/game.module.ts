import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoardComponent} from "./board/board.component";
import {LeaderboardComponent} from "./leaderboard/leaderboard.component";
import {LoaderComponent} from "./loader/loader.component";


@NgModule({
  declarations: [
    BoardComponent,
    LeaderboardComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoaderComponent,
    ]
})
export class GameModule { }
