import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-delete_user',
  templateUrl: './delete_user.component.html',
  styleUrls: ['./delete_user.component.css']
})

export class DeleteUserComponent {
  username: string;
  basura: string;
  constructor( 
    public socketService: WebSocketService
  ){
    //this.username = socketService.getUsername();
  }
  
  onDeleteUser(){
    console.log(this.username);
    const user = {socketId: this.socketService.socketID};
    //this.userService.onDeleteUser(user);
    this.socketService.onDeleteUser(user);

  }

  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
