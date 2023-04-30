import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{
  @Input() name: string = "Product name";
  @Input() price: number = 0;
  @Input() image_path: string;

  constructor() {
  }

  ngOnInit(): void {

  }
  buy_product() {
    /// TODO : Buy product from shop with link to backend
  }
}
