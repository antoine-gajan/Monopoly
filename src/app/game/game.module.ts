import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BoardComponent} from "./board/board.component";
import {LoaderComponent} from "./loader/loader.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BoardComponent,
    LoaderComponent,
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
