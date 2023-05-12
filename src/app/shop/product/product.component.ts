import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../game/response-type";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  @Input() product : Product;
  comprado : boolean = false;
  usado : boolean = false;
  comprado_prueba : boolean = false;
  usado_prueba : boolean = false;

  constructor() {
  }

  ngOnInit(): void {

  }

  getImageUrl() {
    return 'data:image/png;base64,' + this.product.imagen;
} 

  buy_product(){
    //TODO: si el back deja comprarlo -> this.puedoComprar
    //this.comprado_prueba = true;
    
  }

  usar_product() {
    /// TODO : Buy product from shop with link to backend
    //this.usado_prueba = true;
  }
}
