import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProprietyCardComponent} from "./propriety-card/propriety-card.component";
import {ChanceCardComponent} from "./chance-card/chance-card.component";
import {CommunityCardComponent} from "./community-card/community-card.component";

@NgModule({
  declarations: [
    ProprietyCardComponent,
    ChanceCardComponent,
    CommunityCardComponent],
  imports: [
    CommonModule
  ]
})
export class CardModule { }
