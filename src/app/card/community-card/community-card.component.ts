import { Component } from '@angular/core';
import {Community} from "../community";

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.css']
})
export class CommunityCardComponent {
  community: Community;
}
