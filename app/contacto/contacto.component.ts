import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent{
  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}

