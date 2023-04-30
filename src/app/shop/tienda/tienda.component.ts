import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";


@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent {

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

}
