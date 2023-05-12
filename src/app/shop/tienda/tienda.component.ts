import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {WebSocketService} from "../../web-socket.service";
import {Product} from "../../game/response-type";


@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent {

  products: Product[] = [];
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private socketService: WebSocketService
  ) {}

  ngOnInit(): void {
    // Get all products from shop
    this.socketService.tienda().subscribe(
      (products) => {
        console.log(products);
        this.products = products;
      });
  }

}
