import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-ajustes_usuario',
  templateUrl: './ajustes_usuario.component.html',
  styleUrls: ['./ajustes_usuario.component.css']
})

export class AjustesUsuarioComponent {
  username: string;
  constructor(private userService: UserService) {
    this.username = userService.getUsername();
  }
}