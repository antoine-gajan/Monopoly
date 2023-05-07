import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { FormControl } from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-cambiar_nombre_usuario',
  templateUrl: './cambiar_nombre_usuario.component.html',
  styleUrls: ['./cambiar_nombre_usuario.component.css']
})

export class CambiarUsernameComponent {
  form: FormGroup;
  old_username: string;
  socketID: string;
  mostrarError: boolean = false;
  //new_username: string;
  
  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private router: Router,
    private socketService: WebSocketService
  ) {
    this.form = this.fb.group({
      new_username: ['', [Validators.required]]
    });
    this.old_username = socketService.getUsername();
    
  }
  get new_username() {
    return this.form.get('new_username');
  }
  ngOnInit() {
    //this.old_username = this.socketService.getUsername();
    //this.socketID = this.socketService.getSocketID();
    this.socketID = localStorage.getItem('socketID') ?? '';
    if(!this.socketID){
      this.socketService.connect();
      this.socketID = this.socketService.valorConstante;
      localStorage.setItem('socketID', this.socketID);
    }
  }
  guardar_new_username(){
    //this.socketID = this.socketService.getSocketID();
    const username_change = {
      username: this.old_username,
      newusername: this.form.value.new_username,
      socketId: this.socketID  
    };
    console.log("CAMBIAR USERNAME", this.old_username, this.form.value.new_username);
    this.socketService.guardar_new_username(this.old_username, this.form.value.new_username)
      .then((cambio_username: boolean) => {
        this.mostrarError = !cambio_username;
        console.log("CAMBIAR USERNAME", cambio_username);
      })
      .catch(() => {
        this.mostrarError = true;
        console.log("CAMBIAR USERNAME", false);
      })
      .finally(() => {
      });
    /*this.userService.guardar_new_username(username_change).subscribe(
      (response) => {
        console.log(response.status);
        this.userService.setUsername(this.form.value.new_username);
        console.log(this.userService.getUsername());
        console.log(this.new_username);
        location.reload();
      },
      (error) => {
        console.log(error);
      }
    );*/
  }
}