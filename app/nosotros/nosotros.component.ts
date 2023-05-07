import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent {

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}
  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngOnInit(): void {
    setTimeout(function() {
      const floatingImage = document.getElementById('floating-image');
      const mainContainer = document.getElementById('main');
      if (floatingImage && mainContainer) {
        floatingImage.style.opacity = '1';
        floatingImage.style.transform = 'translateY(0)';
        mainContainer.style.opacity = '1';
        mainContainer.style.transform = 'translateY(0)';
      }
    }, 10);
  }
  
  
  

}
