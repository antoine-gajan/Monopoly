import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../game/response-type";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  @Input() product : Product;

  constructor() {
  }

  ngOnInit(): void {

  }

  getImageUrl() {
    return 'data:image/png;base64,' + this.product.imagen;
}

  buy_product() {
    /// TODO : Buy product from shop with link to backend
  }
}
