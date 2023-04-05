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
  //form!: FormGroup; // Store the form
  //loading = false; // If form send but not done
  //submitted = false; // If form is sent
  username: string;
  password: string;
  constructor( public userService: UserService
    /*private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location*/
  ) {}

  ngOnInit(): void {
    //console.log("He llegado al inicio de sesion");
  }
  /*ngOnInit() {
    /// Init the form with validators
    this.form = new FormGroup({
    username: new FormControl(this.email, [
      Validators.required,
      Validators.minLength(4),
      Validators.email
    ]),
      password: new FormControl(this.password, [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  }*/

  //onSubmit(){
  //}

  login(){
    console.log(this.username, this.password);
    const user = {username: this.username, password: this.password};
    console.log(user);
    this.userService.login(user);
    
  }

}
/*
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form!: FormGroup; // Store the form
  loading = false; // If form send but not done
  submitted = false; // If form is sent
  username: string | undefined;
  password: string | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    /// Init the form with validators
    this.form = new FormGroup({
    username: new FormControl(this.username, [
      Validators.required,
      Validators.minLength(4),
      Validators.email
    ]),
      password: new FormControl(this.password, [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  }

  onSubmit(){
    /// Submit the form
  }

}*/