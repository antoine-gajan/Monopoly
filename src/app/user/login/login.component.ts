import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { AppRoutingModule } from 'app/app-routing.module';
import { Router } from '@angular/router';
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  username: string;
  password: string;
  constructor( public userService: UserService, private router: Router) {}

  ngOnInit(): void {
    //console.log("He llegado al inicio de sesion");
  }

  login(){
    this.userService.setUsername(this.username);
    //this.router.navigate(['/pantalla', { username: this.username }]);
    console.log(this.username, this.password);
    const user = {username: this.username, password: this.password};
    console.log(user);
    this.userService.login(user);
  }
}
