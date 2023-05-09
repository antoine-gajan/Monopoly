import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { environment } from 'enviroment/enviroment';
import { Router } from '@angular/router';
import { LoginComponent } from './user/login/login.component';


@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  localSocketID: string;
  idPartida: number;
  username: string;
  private email: string;
  private picture: string;
  private _socketID: string;
  private socket = io(environment.socketURL, { transports: ["websocket"] });

  constructor(private router: Router) {
    this.socket.on('connect', () => {
      this._socketID = this.socket.id;
      console.log('Socket conectado con ID:', this._socketID);

    });
  }

  get socketID(): string {
    return this._socketID;
  }

  getSocketID() {
    localStorage.setItem('socketID', this.socket.id);
    // Obtener el valor del ID del socket desde una cookie o del almacenamiento local
    this._socketID = localStorage.getItem('socketID') || '';
    console.log('getSocketID: ', this._socketID);
    return this._socketID;
  }

  public consultarImagen(): Promise<string>{
    return new Promise<string>((resolve, reject) => {
      this.socket.emit('imagenPerfil', ({socketId: this.socketID}), (ack: any) => {
        if (ack.cod === 0) {
          console.log('Imagen de perfil:', ack.msg.imagen);
          const blobData = ack.msg.imagen;
          const dataUrl =`data:image/jpg;base64,${blobData}`;
          resolve(dataUrl);
        } else {
          console.log('Error al obtener la información del usuario');
          reject("-1");
        }
      });
    });
  }

  public consultarUsername(): Promise<string>{
    return new Promise<string>((resolve, reject) => {
      this.socket.emit('infoUsuario', ({socketId: this.socketID}), (ack: any) => {
        console.log('ack: ', ack);
        if (ack.cod === 0) {
          console.log('Nombre de usuario', ack.msg.nombreUser);
          resolve(ack.msg.nombreUser);
        } else {
          console.log('Error al obtener la información del usuario');
          reject("-1");
        }
      });
    });
  }

  public consultarEmail(): Promise<string>{
    return new Promise<string>((resolve, reject) => {
      this.socket.emit('infoUsuario', ({socketId: this.socketID}), (ack: any) => {
        if (ack.cod === 0) {
          console.log('Correo del usuario', ack.msg.correo);
          resolve(ack.msg.correo);
        } else {
          console.log('Error al obtener la información del usuario');
          reject("-1");
        }
      });
    });
  }

  //Función que recibe la información necesaria para logear un usuario
  public login(user: any): Promise<boolean> {
    console.log('login: ', user);
    this.localSocketID = user.socketID;
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('login', user, (response: any) => {
        console.log('Login response:', response);
        console.log('Login response.cod:', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          this.router.navigate(['/pantalla']);
          resolve(true);
        } else{
          console.log('Error en el login, usuario o contraseña incorrectos');
          reject(false);
        }
      });
      
    });

  }

  //Función que recibe la información necesaria para registrar un usuario
  public registro(user: any): Promise<boolean>{
    console.log('registro: ', user);
    //this.socket.emit('registro', user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('register', user, (response: any) => {
      console.log('Registro response:', response);
      console.log('Registro response.cod:', response.cod);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        this.router.navigate(['/pantalla']);
        resolve(true);
      } else if(response.cod === 1){
        console.log('CREAR CUENTA: ya existe un usuario con ese username');
        reject(false);
      } else{
        console.log('Error en el registro');
      }
    });
    
  });
    
  }

  //Función que recibe la información necesaria para cambiar el nombre de un usuario
  guardar_new_username(user: any): Promise<boolean>{
    //user.socketID = this.localSocketID;
    console.log('guardar_new_username: ', user);
    //this.socket.emit('updateUsername', user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('updateUsername', user, (response: any) => {
      console.log('updateUsername response:', response);
      console.log('updateUsername response.cod:', response.cod);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        resolve(true);
        //location.reload();
      } else{
        console.log('Error al cambiar el nombre de usuario');
        reject(false);
      }
    });
  });
  }
  
  //Función que recibe la infomación necesaria para eliminar a un usuario
  onDeleteUser(user: any){
    console.log('onDeleteUser: ', user);
    this.socket.emit('deleteUser', user, (response: any) => {
      console.log('deleteUser response:', response);
      console.log('deleteUser response.cod:', response.cod);
      if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
        this.router.navigate(['/login']);
      } else{
        console.log('Error al cambiar el nombre de usuario');
      }
    });
  }
  
  crearSalaInvitado(user: any): Promise<boolean>{
    //const user = {username: nombreUserInivtado, socketId: this.localSocketID};
    console.log('crearSalaInvitado: ', user);
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('nombreInvitado', user, (response: any) => {
        console.log('unirse sala invitado: ', response);
        console.log('unirse sala invitado: ', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          this.router.navigate(['/crear_sala']);
          resolve(true);
        } else{
          console.log('al crear la sala invitado');
          reject(false);
        }
      });
      
    });
  }

  public guardar_cambio_password(user: any): Promise<boolean> {
    console.log('guardar_cambio_password: ', user);
    this.localSocketID = user.socketID;
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('updatePassword', user, (response: any) => {
        console.log('guardar_cambio_password response:', response);
        console.log('guardar_cambio_password  response.cod:', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          //location.reload();
          resolve(true);
        } else{
          console.log('Error en el login, usuario o contraseña incorrectos');
          reject(false);
        }
      });
      
    });

  }

  public guardar_nuevo_correo(user: any): Promise<boolean> {
    console.log('guardar cambio email: ', user);
    this.localSocketID = user.socketID;
    return new Promise<boolean>((resolve, reject) => {
        this.socket.emit('updateCorreo', user, (response: any) => {
        console.log('guardar cambio email response:', response);
        console.log('guardar cambio email  response.cod:', response.cod);
        console.log('guardar cambio email  response.msg:', response.msg);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          
          resolve(true);
        } else{
          console.log('Error al hacer un update del correo');
          reject(false);
        }
      });
    });
  }

  public crearSala(user: any): Promise<number> {
    console.log("CREAR PARTIDA-SALA", user);
  
    return new Promise((resolve) => {
      this.socket.emit('crearPartida', user, (response: any) => {
        console.log('crearPartida response:', response);
        console.log('crearPartida response.cod:', response.cod);
        console.log('crearPartida response.msg:', response.msg);
        if (response.cod === 0) {
          resolve(response.msg);
        } else {
          console.log('Error al crear la sala');
          resolve(-1);
        }
      });
    });
  }

  /**public crearSala(user: any){
    console.log("CREAR PARTIDA-SALA", user);
    return new Promise<boolean>((resolve, reject) => {
      this.socket.emit('crearPartida', user, (response: any) => {
        console.log('crearPartida response:', response);
        console.log('crearPartida response.cod:', response.cod);
        if (response.cod === 0) { // Si el código de confirmación es 200, redirigir a la pantalla de usuario
          //this.router.navigate(['/crear_sala']);
          resolve(true);
          let idPartida = '';
          if (response.msg !== null && response.msg !== undefined) {
            idPartida = response.msg;
          }
          const ruta = '/esperar_sala/' + idPartida;
          //this.router.navigateByUrl(ruta);
        } else{
          console.log('Error al crear la sala');
          reject(false);
        }
      });
    });
  } */

  public unirseSalaEsperar(user: any): Promise<string> {
    console.log("UNIRSE SALA ESPERAR", user);
    
    
    return new Promise<string>((resolve, reject) => {
      this.socket.emit('unirJugador', user, (response: any) => {
        
        console.log('unirJugador response:', response);
        console.log('unirJugador response.cod:', response.cod);
        if (response.cod == 0) {
          let idPartida = '';
          idPartida = user.idPartida;
          const ruta = '/esperar_sala/' + idPartida;
          this.router.navigateByUrl(ruta);
          resolve(response.cod);
        }  else {
          console.log('Error al unirse a la sala');
          resolve(response.cod);
        }
      });
    });
  }
  
  actualizarUsuariosConectados(): Promise<string[]>{
    return new Promise((resolve, reject) => {
      this.socket.on('esperaJugadores', (info) => {
        if (typeof info === 'object' && info !== null) {
          const keys = Object.keys(info);
          const usuariosConectados = keys.map((key) => `${key}: ${info[key]}`);
          resolve(usuariosConectados);
        } else {
          reject('La información recibida no es un objeto');
        }
      });
    });
  }

  hacerOnSocket(){
    this.socket.on('esperaJugadores', (ack: any) => {
      console.log('Server acknowledged:', ack);
    });
  }

  /**public crearPartida(){
    this.socket.emit('crearPartida', {
      socketId: 
  }, (ack) => {
      console.log('Server acknowledged:', ack);
      if(ack.cod == 0){
          navigation.navigate('CrearSala', {idPartida: ack.msg});
      }
      else if(ack.cod != 2){
          alert(ack.msg);
      }
      else{
          alert("Se ha producido un error en el servidor, por favor, pulse otra vez el boton");
      }
  });
  }  */

  public crearPartida(): Promise<number> {
    console.log("CREAR PARTIDA-SALA v2");
  
    return new Promise((resolve) => {
      this.socket.emit('crearPartida', {socketId: this.socketID}, (ack: any) => {
        console.log('Server acknowledged:', ack);
      if(ack.cod == 0){
        console.log("ENTRA");
          resolve(ack.msg.id);
      }
      else if(ack.cod != 2){
          resolve(ack.msg.id);
      }
      else{
          alert("Se ha producido un error en el servidor, por favor, pulse otra vez el boton");
      }
      });
    });
  }
  
  public actualizarDatosCrearPartida(datos: any){
    this.socket.emit('actualizarPartida', datos, (ack:any) => {
      if(ack.cod==0){
        console.log("ACTUALIZACIÓN CORRECTA");
        if(datos.jugar == true){
          const ruta = '/game/' + this.idPartida;
          this.router.navigate([ruta]);
        }
      }
    })
  }

  public escucharEntrarAJugar(): Promise<string>{
    return new Promise ((resolve) => {
      this.socket.on('comenzarPartida', (ack: any) => {
        console.log('Valor escuchar para entrar a jugar:', ack);
        resolve(ack);
      });
   });
  }

  public consultarUsuario(): Promise<any>{
    return new Promise ((resolve) => {
      this.socket.emit('infoUsuario', {socketId: this.socketID}, (ack: any) => {
        if(ack.cod==0){
          console.log('Valor escuchar para entrar a jugar:', ack);
          resolve(ack);
        } else {
          console.log("Error al consultar usuario");
        }
      });
   });
  }

  /*-------------------------------------------FUNCIONES DEL GAME/TABLERO-------------------------------------------*/
  public lanzarDados(){
    console.log("LANZAR DADOS SOCKET");
    this.socket.emit('lanzarDados', {socketId: this.socketID}, (ack: any) => {
      console.log('Server acknowledged:', ack);
    });
    console.log("------------------");
  }

  public nombreInvitado(nombreUser: string): Promise<string>{
    return new Promise ((resolve) => {
      this.socket.emit('nombreInvitado', {username: nombreUser, socketId: this.socketID}, (ack: any) => {
        console.log("Resultado de crear invitado: ", ack);
        if(ack.cod == 0){
          console.log("Se ha creado correctamente");
          resolve(ack.cod);
        }
      })
    });
  }
}