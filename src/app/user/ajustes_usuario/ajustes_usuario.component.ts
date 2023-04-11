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
  }

  leer_email(){
    this.email = (this.userService.leer_email(this.username)).toString();
    this.router.navigate(['/cambiar_correo', { email: this.email }]);
  }
}