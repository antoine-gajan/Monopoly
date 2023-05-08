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
import { WebSocketService } from 'app/web-socket.service';
import { Socket } from 'ngx-socket-io';

import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;
  passwordShow: boolean = false;
  mostrarError: boolean = false;
  wrongPassword: boolean = false;
  
  //private socket: SocketIoClient.Socket;
  constructor(
    private fb: FormBuilder,
    //public userService: UserService, 
    private router: Router, 
    private socketService: WebSocketService
  ) {
    // this.socket = io(environment.socketURL);
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.minLength(8),Validators.required]]
    });
  }
  ngOnInit() {
    this.mostrarError = false;
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
    this.mostrarError = false;
    console.log("LOGIN", this.form.valid);
    if (this.form.valid) {
      this.socketService.setUsername(this.form.value.username);

      const nuevo_password = CryptoJS.SHA512(this.form.value.password).toString();
      const user = {username: this.form.value.username, password: nuevo_password, socketId: this.socketService.socketID};

      console.log("LOGIN: ", user);
      this.socketService.login(user)
        .then((loginResponse: boolean) => {
          this.mostrarError = !loginResponse;
        })
        .catch(() => {
          this.mostrarError = true;
        });
    }
    else {
      this.mostrarError = true;
      console.log("LOGIN: Valores mal introducidos");
    }
  }

  passwordMostrarOcultar(){
    this.passwordShow = !this.passwordShow;
  }
  error(){
    this.wrongPassword = true;
  }
  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}