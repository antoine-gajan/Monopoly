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

  ngOnInit() {
    // Get username from browser
    this.username = localStorage.getItem('username');
    if (this.username == null) {
      this.router.navigate(['/error']);
    }
  }

  /*username: any;
  constructor(private route: ActivatedRoute, private userService: UserService) {
    //this.username = this.route.snapshot.paramMap.get('username') ?? 'usuario';
  }
  ngOnInit() {
    this.userService.getUsername();
    //this.hacerPeticion();
  }
*/
  /*hacerPeticion(){
    this.userService.hacerPeticion();
  }

  ajustes_usuario(){
    this.userService.hacerPeticion();
  }*/
}
