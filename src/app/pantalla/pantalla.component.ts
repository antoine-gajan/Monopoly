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
  id_partida_nueva: number;

  constructor(private userService: UserService) {
    this.username = userService.getUsername();
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
