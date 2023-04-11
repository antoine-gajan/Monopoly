import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AppRoutingModule } from 'app/app-routing.module';
import { Router } from '@angular/router';
import { response } from 'express';

@Injectable({
  providedIn: "root"

})
export class UserService {
  private username: string;
  private newusername: string;
  private email: string;
  private password: string;
  private confirm_password: string;
  //username: string;
  //newusername: string;

  constructor(private http: HttpClient,
    private router: Router)  {}


  setUsername(username: string): void {
    this.username = username;
  }
  setEmail(email: string): void {
    this.email = email;
  }

  getUsername(): string {
    return this.username;
  }

  hacerPeticion() {
    return this.http.get('/http://localhost:3000/users/login').pipe(
      map((response: any) => response.username)
    );

    
  }
  
  login(user: any){
    console.log(user);
    this.setUsername(user.username);
    
    return this.http.post('http://localhost:3000/users/login'/*http:nerks.net:7003/users/login'*/, user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                          this.router.navigateByUrl('/pantalla');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }
  registro(user: any){
    console.log(user);
    this.setUsername(user.username);
    this.setEmail(user.email);
    return this.http.post('http://localhost:3000/users/register'/*nerks.net:7003/users/register'*/, user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                          this.router.navigateByUrl('/pantalla');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }

  guardar_new_username(user: any){
    console.log(user);
    return this.http.put('http://localhost:3000/users/updateUsername'/*'http://nerks.net:7003/users/updateUsername'*/, user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                        this.username = user.newusername;
                        this.router.navigateByUrl('/ajustes_usuario');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }

  /*leer_email(user: any){
    //console.log("SI LO HACE");
    console.log(user);
    //this.setUsername(user.username);
    return this.http.get('/http://localhost:3000/users/devolverCorreo').pipe(
      map((response: any) => response.username)
    );
    return this.http.get('http://localhost:3000/users/devolverCorreo'/*http:nerks.net:7003/users/devolverCorreo'*, user)
                    .subscribe(
                      (response) => {
                        console.log(response);
                          this.router.navigateByUrl('/pantalla');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );    
  }*/

  /*leer_email_aux(){
    return (leer_email(username)).toString();
  }*/
  guardar_nuevo_correo(user: any){
    console.log(user);
    return this.http.put('http://localhost:3000/users/updateCorreo'/*'http://nerks.net:7003/users/updateCorreo'*/, user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                          this.router.navigateByUrl('/ajustes_usuario');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }

  guardar_cambio_password(user: any){
    console.log(user);
    return this.http.put('http://localhost:3000/users/updatePassword', user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                          this.router.navigateByUrl('/ajustes_usuario');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }

  onDeleteUser(user: any){
    const options = { body: user };
    this.http.delete('http://localhost:3000/users/delete'/*http://nerks.net:7003/users/delete'*/, options)
                    .subscribe(
                      (response) => { this.router.navigateByUrl('/'); },
                      (error) => { console.log(error); }
                    );
  }

 }
