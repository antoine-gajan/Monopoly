import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delete_user',
  templateUrl: './delete_user.component.html',
  styleUrls: ['./delete_user.component.css']
})

export class DeleteUserComponent {
  username: string;
  basura: string;
  constructor( public userService: UserService){
    this.username = userService.getUsername();
  }
  
  onDeleteUser(){
    console.log(this.username);
    const user = {username: this.username};
    this.userService.onDeleteUser(user);
  }
}
