import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'enviroment/enviroment';
import * as CryptoJS from 'crypto-js';
//import { io, Socket } from 'socket.io-client';


interface EmailInt {
  email: string;
}
interface RespuestaNumJugadores {
  numJugadores: number;
}
@Injectable({
  providedIn: 'root'

})
export class UserService {
  
  id_socket: string;

  private username: string;
  private newusername: string;
  private email: string;
  private password: string;
  private confirm_password: string;

  constructor(private http: HttpClient,
    private router: Router/*, private socket: Socket*/) {
      
      //this.socket = io(environment.socketURL); // Cambia esto por la URL de tu servidor de sockets.io
    }

  setUsername(username: string): void {
    localStorage.setItem('username', username);
    this.username = username;
  }
  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  getUsername(): string {
    // Get username from browser
    let username_browser = localStorage.getItem('username');
    let username_client = this.username;
    return username_browser ? username_browser : username_client;
  
  }

  

  /*login(user: any){
    console.log(user);
    const nuevo_password = CryptoJS.SHA512(user.password).toString();
    console.log(user);
    user.password = nuevo_password;
    this.setUsername(user.username);

    return this.http.post(environment.login, user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                          this.router.navigateByUrl('/pantalla');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }*/
  login(user: any) {
    const nuevo_password = CryptoJS.SHA512(user.password).toString();
    user.password = nuevo_password;
    this.setUsername(user.username);
    console.log("LOGIN", user);
    // Emit a 'login' event with the user object to the server using socket.io
    //this.socket.emit('login', user);

    //return this.http.post(environment.login, user, {responseType: 'text', observe: 'response'});
  }
  

 

 



}
