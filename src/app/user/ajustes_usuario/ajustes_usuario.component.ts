import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-ajustes_usuario',
  templateUrl: './ajustes_usuario.component.html',
  styleUrls: ['./ajustes_usuario.component.css']
})

export class AjustesUsuarioComponent {
  username: string;
  email: string;
  picture: string;

  constructor(
    private route: ActivatedRoute,
    private socketService: WebSocketService
  ) {
    
  }

  ngOnInit() {
    
    this.socketService.consultarUsuario()
    .then ((usuario: any) => {
      console.log("usuario: ", usuario);
      this.username = usuario.msg.nombreUser;
      this.email = usuario.msg.correo;
      const blobData = usuario.msg.imagen;
      console.log("blobData: ", blobData);
      const dataUrl =`data:image/jpg;base64,${blobData}`;
      console.log("dataUrl: ", dataUrl);
      this.picture = dataUrl;
    })
    .catch(() => {
      console.log("ERROR AL OBTENER USUARIO");
    });
    console.log("-1", this.username);
    console.log("-2", this.email);
  }
  
  obtenerPicutre(){
    this.socketService.consultarImagen()
    .then((imagenUsuario: string) => {
      console.log("imagenUsuario: ", imagenUsuario);
      this.picture = imagenUsuario;
      this.socketService.setPicture(imagenUsuario);
    })
    .catch(() => {
      console.log("ERROR AL OBTENER IMAGEN");
    });
    this.socketService.setPicture(this.picture);
  }

  obtenerNombreUsuario(){
    this.socketService.consultarUsername()
    .then((nombreUsuario: string) => {
      console.log("nombreUser: ", nombreUsuario);
      this.username = nombreUsuario;
      this.socketService.setUsername(nombreUsuario);
    })
    .catch(() => {
      console.log("ERROR AL OBTENER USERNAME");
    });
  }

  obtenerEmail(){
    this.socketService.consultarEmail()
    .then((emailUser: string) => {
      console.log("nombreUser: ", emailUser);
      this.username = emailUser;
      this.socketService.setEmail(emailUser);
    })
    .catch(() => {
      console.log("ERROR AL OBTENER EMAIL");
    });
  }
  
  
}