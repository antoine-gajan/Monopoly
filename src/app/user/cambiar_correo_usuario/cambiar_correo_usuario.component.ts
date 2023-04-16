import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cambiar_correo_usuario',
  templateUrl: './cambiar_correo_usuario.component.html',
  styleUrls: ['./cambiar_correo_usuario.component.css']
})

export class CambiarCorreoComponent {
  username: string;
  old_email: string;
  new_email: string;
  constructor( public userService: UserService, private router: Router){
    this.username = userService.getUsername();
    userService.leer_email({username: this.username})
    .subscribe(
      (response) => {
        console.log(response.body);
        userService.setEmail(response.body?.email ?? '');
        this.old_email = userService.getEmail();
        console.log(this.old_email);
        //this.router.navigate(['/ajustes_usuario']);
      },
      (error) => {
        console.log(error);
      }
    );  
    
    //this.old_email = this.route.snapshot.paramMap.get('email') ?? 'correo';
  }
  ngOnInit(): void {
    
  } 
  /*leer_email(){
    return (this.userService.leer_email(this.username)).toString();
  }*/
  guardar_nuevo_correo(){
    //this.email = (this.userService.leer_email(this.username)).toString();
    console.log(this.old_email);
    const user = {username: this.username, email: this.new_email};
    console.log(user);
    this.userService.guardar_nuevo_correo(user);
  }
}
