import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { WebSocketService } from 'app/web-socket.service';
@Component({
  selector: 'app-cambiar_correo_usuario',
  templateUrl: './cambiar_correo_usuario.component.html',
  styleUrls: ['./cambiar_correo_usuario.component.css']
})

export class CambiarCorreoComponent {
  form: FormGroup;
  username: string;
  old_email: string | null = null;
  loading = true;
  //new_email: string;
  constructor(
    private fb: FormBuilder,
    //public userService: UserService,
    private router: Router,
    private socketService: WebSocketService
  ){
    this.form = this.fb.group({
      new_email: ['', [Validators.email, Validators.required]]
    });
    this.username = socketService.getUsername();
    this.socketService.leerEmail({socketId: this.socketService.socketID})
      .then((correo: string) => {
        console.log('Correo leído:', correo);
        this.socketService.setEmail(correo);
        this.old_email = correo;
        // Realizar operaciones con el correo leído
      })
      .catch((error) => {
        console.log('Error leyendo correo:', error);
        // Realizar acciones en caso de error
      });
      
  }

  get new_email() {
    return this.form.get('new_email');
  }
  ngOnInit(): void {
    
  } 
  /*leer_email(){
    return (this.userService.leer_email(this.username)).toString();
  }*/
  guardar_nuevo_correo(){
    if(this.form.valid){
      //this.email = (this.userService.leer_email(this.username)).toString();
      //console.log(this.old_email);
      //const user = {username: this.username, email: this.form.value.new_email};
      //console.log(user);
      this.socketService.setEmail(this.form.value.new_email);
      console.log("ACTUALIZAR CORREO: ", this.form.value.new_email, this.socketService.socketID);
      const user = { email: this.form.value.new_email, socketId: this.socketService.socketID};
      this.socketService.guardar_nuevo_correo(user)
      .then((cambiarCorreoResponse: boolean) => {
        this.router.navigate(['/ajustes_usuario']);
        console.log("Correo guardado");
        
      })
      .catch(() => {
        console.log("Correo no guardado");
      });
    }
  }
}

