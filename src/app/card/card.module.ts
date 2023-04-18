import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProprietyCardComponent } from "./propriety-card/propriety-card.component";
import { ChanceCardComponent } from "./chance-card/chance-card.component";
import { CommunityCardComponent } from "./community-card/community-card.component";
import { PartyCardComponent } from './party-card/party-card.component';
import { ElectricityCardComponent } from './electricity-card/electricity-card.component';
import { HeatCardComponent } from './heat-card/heat-card.component';
import { BuyCardComponent } from './buy-card/buy-card.component';
import {AppModule} from "../app.module";
import {GameModule} from "../game/game.module";

@NgModule({
  declarations: [
    ProprietyCardComponent,
    ChanceCardComponent,
    CommunityCardComponent,
    PartyCardComponent,
    ElectricityCardComponent,
    HeatCardComponent,
    BuyCardComponent],
    imports: [
        CommonModule,
        GameModule,
    ],
  exports: [
    ProprietyCardComponent,
    PartyCardComponent,
    HeatCardComponent,
    ElectricityCardComponent,
    BuyCardComponent,
    ]
})
export class CardModule { }
