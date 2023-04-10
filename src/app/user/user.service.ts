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

  getEmail(): string {
    return this.email;
  }

  hacerPeticion() {
    return this.http.get('/http://localhost:8080/users/login').pipe(
      map((response: any) => response.username)
    );
  }
  
  login(user: any){
    console.log(user);
    this.setUsername(user.username);
    
    return this.http.post('http://localhost:8080/users/login'/*http:nerks.net:7003/users/login'*/, user, {responseType: 'text', observe: 'response'})
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
    return this.http.post('http://localhost:8080/users/register'/*nerks.net:7003/users/register'*/, user, {responseType: 'text', observe: 'response'})
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

  /*guardar_new_username(username: string, newusername: string){
    console.log(username, newusername);
    return this.http.put('http://localhost:8080/users/updateUsername'/*'http://nerks.net:7003/users/updateUsername'*,{username: 'pilar', newusername: 'pilar1'})
                    .subscribe(
                      (response) => {
                        console.log(response);
                        this.router.navigateByUrl('/ajustes_usuario');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }*/

  /*guardar_new_username(old_u: string, new_u: string){
    console.log(old_u, new_u);
    return this.http.put('http://localhost:8080/users/updateUsername'/*'http://nerks.net:7003/users/updateUsername'/, {oldusername: old_u, newusername: new_u})
                    .subscribe(
                      (response) => {
                        console.log(response);
                        this.setUsername(new_u);
                        this.router.navigateByUrl('/ajustes_usuario');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
}*/
  guardar_new_username(user: any){
    console.log(user);
    return this.http.put('http://localhost:8080/users/updateUsername'/*'http://nerks.net:7003/users/updateUsername'*/, user, {responseType: 'text', observe: 'response'})
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

  guardar_nuevo_correo(user: any){
    console.log(user);
    return this.http.put('http://localhost:8080/users/updateCorreo'/*'http://nerks.net:7003/users/updateCorreo'*/, user, {responseType: 'text', observe: 'response'})
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
    return this.http.put('http://nerks.net:7003/users/updatePassword', user, {responseType: 'text', observe: 'response'})
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

  onDeleteUser(user: any){
    console.log(user);
    return this.http.delete('http://nerks.net:7003/users/delete', user)
                    .subscribe(
                      (response) => {
                        //console.log(response.status);
                          this.router.navigateByUrl('/pantalla');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }
 }
