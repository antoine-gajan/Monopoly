import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProprietyCardComponent } from "./propriety-card/propriety-card.component";
import { ChanceCardComponent } from "./chance-card/chance-card.component";
import { CommunityCardComponent } from "./community-card/community-card.component";
import { PartyCardComponent } from './party-card/party-card.component';
import { ElectricityCardComponent } from './electricity-card/electricity-card.component';
import { HeatCardComponent } from './heat-card/heat-card.component';
import { InteractionCardComponent } from './interaction-card/interaction-card.component';
import {GameModule} from "../game/game.module";
import { InfoCardComponent } from './info-card/info-card.component';
import { JailCardComponent } from './jail-card/jail-card.component';
import { SubastaCardComponent } from './subasta-card/subasta-card.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    ProprietyCardComponent,
    ChanceCardComponent,
    CommunityCardComponent,
    PartyCardComponent,
    ElectricityCardComponent,
    HeatCardComponent,
    InteractionCardComponent,
    InfoCardComponent,
    JailCardComponent,
    SubastaCardComponent,
    AlertComponent],
    imports: [
      CommonModule,
      GameModule,
    ],
  exports: [
    ProprietyCardComponent,
    PartyCardComponent,
    HeatCardComponent,
    ElectricityCardComponent,
    InteractionCardComponent,
    ]
})
export class CardModule { }
