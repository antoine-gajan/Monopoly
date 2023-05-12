import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../game/response-type";
import {WebSocketService} from "../../web-socket.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  @Input() product : Product;
  @Output() refresh_shop = new EventEmitter();

  constructor(private socketService: WebSocketService) {
  }

  ngOnInit(): void {
  }

  getImageUrl() {
    return 'data:image/png;base64,' + this.product.imagen;
}

  buy_product(){
    // Buy product
    this.socketService.comprarTienda({socketId: this.socketService.socketID, producto: this.product.nombre}).subscribe(
      (msg) => {
        console.log(msg);
        console.log("Se ha comprado el producto: " + this.product.nombre);
        this.refresh_shop.emit();
      });
  }

  usar_product() {
    /// TODO : Use product from shop with link to backend
    this.refresh_shop.emit();
  }
}
