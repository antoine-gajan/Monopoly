import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { AppRoutingModule } from 'app/app-routing.module';
import { Router } from '@angular/router';
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  constructor( public userService: UserService
  ) {}

  ngOnInit(): void {
  }

  registro(){
    console.log(this.username, this.email, this.password, this.confirm_password);
    const user = {username: this.username, email: this.email, password: this.password, confirm_password: this.confirm_password};
    console.log(user);
    this.userService.registro(user);
    
  }

}