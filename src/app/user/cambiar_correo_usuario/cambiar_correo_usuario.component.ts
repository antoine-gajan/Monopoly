import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-cambiar_correo_usuario',
  templateUrl: './cambiar_correo_usuario.component.html',
  styleUrls: ['./cambiar_correo_usuario.component.css']
})

export class CambiarCorreoComponent {
  username: string;
  email: string;
  constructor( public userService: UserService, private route: ActivatedRoute){
    this.username = userService.getUsername();
    //this.email = (userService.leer_email(this.username)).toString();
    
    this.email = this.route.snapshot.paramMap.get('email') ?? 'correo';
  }
  ngOnInit(): void {
    
  }
  /*leer_email(){
    return (this.userService.leer_email(this.username)).toString();
  }*/
  guardar_nuevo_correo(){
    //this.email = (this.userService.leer_email(this.username)).toString();
    console.log(this.email);
    const user = {username: this.username };
    console.log(user);
    this.userService.guardar_nuevo_correo(user);
    
  }
}
