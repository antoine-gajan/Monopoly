import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { FormControl } from '@angular/forms';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cambiar_nombre_usuario',
  templateUrl: './cambiar_nombre_usuario.component.html',
  styleUrls: ['./cambiar_nombre_usuario.component.css']
})

export class CambiarUsernameComponent {
  form: FormGroup;
  old_username: string;
  //new_username: string;
  
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.form = this.fb.group({
      new_username: ['', [Validators.required]]
    });
    this.old_username = userService.getUsername();
  }
  get new_username() {
    return this.form.get('new_username');
  }
  ngOnInit(): void {}
  guardar_new_username(){
    console.log("CAMBIAR USERNAME");
    //this.username_anterior = this.miFormulario.get('nombreCampo').value;
    // Aquí se actualiza el campo con el nuevo valor
    //this.username_anterior = this.form.controls['username'].value;
    const username_change = {username: this.old_username, newusername: this.form.value.new_username};
    //this.userService.guardar_new_username(this.old_username, this.new_username);
    this.userService.guardar_new_username(username_change).subscribe(
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
    );
  }
}
