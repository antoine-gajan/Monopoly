import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoardComponent} from "./board/board.component";
import {LeaderboardComponent} from "./leaderboard/leaderboard.component";
import {LoaderComponent} from "./loader/loader.component";
import { DevolutionPropertiesFormComponent } from './devolution-properties-form/devolution-properties-form.component';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BoardComponent,
    LeaderboardComponent,
    LoaderComponent,
    DevolutionPropertiesFormComponent
  ],
    imports: [
        CommonModule,
        FormsModule,
    ],
  exports: [
    LoaderComponent,
    ]
})
export class GameModule { }
