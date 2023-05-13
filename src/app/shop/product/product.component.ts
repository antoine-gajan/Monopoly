import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../game/response-type";
import {WebSocketService} from "../../web-socket.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  @Input() product : Product;

  constructor(private socketService: WebSocketService, private cdr: ChangeDetectorRef) {
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
        this.cdr.detectChanges();
      });
  }

  usar_product() {
    // Determine type of product
    const lower_name = this.product.nombre.toLowerCase();
    if (lower_name.includes("ficha")) {
      /// TODO: indicate that this product has to be used in the game
      this.cdr.detectChanges();
    }
    else if (lower_name.includes("avatar")) {
      this.socketService.updateImagenPerfil({socketId: this.socketService.socketID, imagen: this.product.imagen}).subscribe(
        {
          next: (msg) => {
            console.log("Se ha cambiado la imagen de perfil");
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.cdr.detectChanges();
          }
        });
    }
  }
}
