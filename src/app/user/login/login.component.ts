import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { AppRoutingModule } from 'app/app-routing.module';
import { Router } from '@angular/router';
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as yup from 'yup';
import { environment } from 'enviroment/enviroment';
import {  Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';
import { SocketIoConfig} from 'ngx-socket-io';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;
  passwordShow: boolean = false;
  
  //private socket: SocketIoClient.Socket;
  constructor(private fb: FormBuilder,public userService: UserService, private router: Router, private socket: Socket) {
    // this.socket = io(environment.socketURL);
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.minLength(8),Validators.required]]
    });
  }
  ngOnInit() {
    // If user is already logged in, redirect to home
    //console.log("He llegado al inicio de sesion");
    const schema = yup.object().shape({
      username: yup.string().required(),
      password: yup.string().min(8).max(1000).required()
    });

    this.form.valueChanges.subscribe(value => {
      schema.validate(value).catch((err) => {
        console.log(err);
      });
    });
  }

  login(){
    console.log("LOGIN", this.form.valid);
    if (this.form.valid) {
      this.userService.setUsername(this.form.value.username);
      //this.router.navigate(['/pantalla', { username: this.username }]);
      console.log(this.form.value.username, this.form.value.password);
      const user = {username: this.form.value.username, password: this.form.value.password};
      console.log(user);
      //this.userService.login(user);
      this.socket.emit('login', user);
    }
    else {
      console.log("Valores mal introducidos");
    }
  }

  passwordMostrarOcultar(){
    this.passwordShow = !this.passwordShow;
  }
  
  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}