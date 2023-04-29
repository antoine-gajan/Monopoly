import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Coordenadas} from "../response-type";
import {GameService} from "../game.service";
import {forkJoin, ObservableInput} from "rxjs";

@Component({
  selector: 'app-devolution-properties-form',
  templateUrl: './devolution-properties-form.component.html',
  styleUrls: ['./devolution-properties-form.component.css']
})
export class DevolutionPropertiesFormComponent {
  @Input() idPartida: number;
  @Input() player_username: string;
  @Input() list_properties: [string, Coordenadas][] = [];
  @Input() is_in_jail: boolean = false;
  @Output() next_step = new EventEmitter();

  selected_properties: [string, Coordenadas][] = [];

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {

  }

  devolve() {
    console.log("Devolution of properties");
    let observables: ObservableInput<any> = [];
    for (let prop of this.selected_properties) {
      console.log(prop);
      /// TODO : Method to devolve the properties selected
      /*
      Call to the backend to devolve the properties
      observables.push(this.gameService.devolve_property(this.idPartida, this.player_username, prop[0], prop[1].h, prop[1].v));
       */
    }

    // Execute observables in parallel and wait for all of them to complete
    /*forkJoin(observables).subscribe(results => {
      console.log('All requests completed:', results);
      if (!this.is_in_jail) {
        this.callback_end_turn();
      }
    }, error => {
      console.error('Error occurred:', error);
      if (!this.is_in_jail) {
        this.callback_end_turn();
      }
    });*/
  }

  updateSelectedProperties(prop : [string, Coordenadas]) {
    // If already in list, remove it
    if (this.selected_properties.includes(prop)) {
      this.selected_properties.splice(this.selected_properties.indexOf(prop), 1);
    }
    // If not in list, add it
    else {
      this.selected_properties.push(prop);
    }
  }

  private go_next_step() {
    // Call end turn or delete pop up card if player is in jail
    this.next_step.emit();
  }
}
