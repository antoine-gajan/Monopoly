import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {WebSocketService} from "../../web-socket.service";
import {InfoPlayerResponse, Product} from "../../game/response-type";


@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent {

  products: Product[] = [];
  infoPlayer: InfoPlayerResponse;
  is_loading: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private socketService: WebSocketService
  ) {}

  ngOnInit(): void {
    // Get all products from shop
    this.socketService.tienda().subscribe(
      {
        next: (products) => {
          this.products = products;
        },
        complete: () => {
          this.socketService.infoUsuario().subscribe(
      {
          next: (infoPlayer) => {
            this.infoPlayer = infoPlayer;
            this.is_loading = false;
          }
          });
        }
      });
  }
}
