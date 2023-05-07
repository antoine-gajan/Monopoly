import {Component, OnInit} from '@angular/core';
import { UserService } from 'app/user/user.service';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})

export class PantallaComponent implements OnInit{

  username: string | null;
  id_partida_nueva: number;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
  }
  
// función que permite volver arriba en la página
volverArriba() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

  ngOnInit() {
    // Get username from browser
    this.username = localStorage.getItem('username');
    if (this.username == null) {
      this.router.navigate(['/error']);
    }
  }
}
