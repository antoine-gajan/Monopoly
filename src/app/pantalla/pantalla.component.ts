import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route} from "@angular/router";
import {Location} from "@angular/common";
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'app/user/user.service';
import { Router } from 'express';

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})

export class PantallaComponent {

  username: string;
  //email: string;

  constructor(private userService: UserService,  private router: Router) {
    this.username = userService.getUsername();
    
  }

  /*leer_email(){
    this.email = (this.userService.leer_email(this.username)).toString();
    //this.router.navigate(['/ajustes_usuario', { username: this.username }]);
  }*/

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
