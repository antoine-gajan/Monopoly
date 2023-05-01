import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as yup from 'yup';

@Component({
  selector: 'app-unirse_sala_invitado',
  templateUrl: './unirse_sala_invitado.component.html',
  styleUrls: ['./unirse_sala_invitado.component.css']
})
export class UnirseSalaInvitadoComponent {
  form_unirse_invitado: FormGroup;
  idPartida: number;
  username: string;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form_unirse_invitado = this.fb.group({
      idPartida: ['', [Validators.required]],
      username: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // If user is already logged in, redirect to home
    //console.log("He llegado al inicio de sesion");
    const schema = yup.object().shape({
      username: yup.string().required(),
      password: yup.string().min(8).max(1000).required()
    });

    this.form_unirse_invitado.valueChanges.subscribe(value => {
      schema.validate(value).catch((err) => {
        console.log(err);
      });
    });
  }
  
  unirseSalaInvitado(){
    console.log("Unirse partida: ", this.username, this.idPartida);
    const datos = {idPartida: this.idPartida, username: this.username};
    this.userService.unirseSalaInvitado(datos);
  }

}
