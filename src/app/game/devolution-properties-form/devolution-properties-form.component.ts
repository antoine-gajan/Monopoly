import {Component, Input} from '@angular/core';
import {Coordenadas} from "../response-type";

@Component({
  selector: 'app-devolution-properties-form',
  templateUrl: './devolution-properties-form.component.html',
  styleUrls: ['./devolution-properties-form.component.css']
})
export class DevolutionPropertiesFormComponent {
  @Input() list_properties: [string, Coordenadas][];

  selected_properties: [string, Coordenadas][] = [];
  constructor() { }

  ngOnInit(): void {

  }

  devolve() {
    /// TODO : Method to devolve the properties selected
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
}
