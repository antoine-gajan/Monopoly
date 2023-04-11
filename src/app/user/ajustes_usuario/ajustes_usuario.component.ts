import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes_usuario',
  templateUrl: './ajustes_usuario.component.html',
  styleUrls: ['./ajustes_usuario.component.css']
})

export class AjustesUsuarioComponent {
  username: string;
  email: string;
  constructor(private userService: UserService, private router: Router) {
    this.username = userService.getUsername();
    this.email = userService.getEmail();
  }

  leer_email(){
    console.log("entra_leer_email");
    //this.email = (this.userService.leer_email(this.username)).toString();
    const user = {username: this.username};
    console.log(this.username, this.email);
    this.router.navigate(['/cambiar_correo', { email: (this.userService.leer_email(user)).toString()}]);
    console.log("sale: leer_email", this.email);
  }
}