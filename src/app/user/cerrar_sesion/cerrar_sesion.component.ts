import {Component} from '@angular/core';

@Component({
  selector: 'app-cerrar_sesion',
  templateUrl: './cerrar_sesion.component.html',
  styleUrls: ['./cerrar_sesion.component.css']
})

export class CerrarSesionComponentAjustes {
  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
