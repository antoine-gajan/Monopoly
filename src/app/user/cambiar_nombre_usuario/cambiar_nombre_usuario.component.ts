import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cambiar_nombre_usuario',
  templateUrl: './cambiar_nombre_usuario.component.html',
  styleUrls: ['./cambiar_nombre_usuario.component.css']
})

export class CambiarUsernameComponent {
  old_username: string;
  new_username: string;
  
  constructor(private userService: UserService, private router: Router) {
    this.old_username = userService.getUsername();
  }

  ngOnInit(): void {}
  guardar_new_username(){
    //this.username_anterior = this.miFormulario.get('nombreCampo').value;
    // Aquí se actualiza el campo con el nuevo valor
    //this.username_anterior = this.form.controls['username'].value;
    const username_change = {username: this.old_username, newusername: this.new_username};
    //this.userService.guardar_new_username(this.old_username, this.new_username);
    this.userService.guardar_new_username(username_change).subscribe(
      (response) => {
        console.log(response.status);
        this.userService.setUsername(this.new_username);
        console.log(this.userService.getUsername());
        console.log(this.new_username);
        this.router.navigate(['/ajustes_usuario']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
