import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'enviroment/enviroment';

interface EmailInt {
  email: string;
}

@Injectable({
  providedIn: "root"

})
export class UserService {
  
  private username: string;
  private newusername: string;
  private email: string;
  private password: string;
  private confirm_password: string;

  constructor(private http: HttpClient,
    private router: Router)  {}


  setUsername(username: string): void {
    this.username = username;
  }
  setEmail(email: string): void {
    this.email = email;
  }

  getEmail(): string {
    return this.email;
  }

  getUsername(): string {
    return this.username;
  }

  hacerPeticion() {
    return this.http.get(environment.login).pipe(
      map((response: any) => response.username)
    );
  }
  
  login(user: any){
    console.log(user);
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
  }
  registro(user: any){
    console.log(user);
    this.setUsername(user.username);
    this.setEmail(user.email);
    return this.http.post(environment.registration, user, {responseType: 'text', observe: 'response'})
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
    return this.http.put(environment.get_ner_username, user, {responseType: 'text', observe: 'response'})
  }

  leer_email(user: any){
    console.log("SI LO HACE");
    console.log(user);
    //this.setUsername(user.username);
    // return this.http.get('/http://localhost:8080/users/devolverCorreo').pipe(
    //   map((response: any) => response.email)
    // ); 
    return this.http.post<EmailInt>(environment.devolver_correo, user, {observe: 'response'}) 
  }

  guardar_nuevo_correo(user: any){
    console.log(user);
    return this.http.put(environment.update_correo, user, {responseType: 'text', observe: 'response'})
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
    return this.http.put(environment.update_password, user, {responseType: 'text', observe: 'response'})
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
    this.http.delete(environment.delete, options)
                    .subscribe(
                      (response) => { this.router.navigateByUrl('/'); },
                      (error) => { console.log(error); }
                    );
  }

  crearPartida(user: any){
    console.log(user);
    return this.http.post(environment.crearPartida, user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                          this.router.navigateByUrl('/game/:id');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }

  unirseSala(user: any){
    console.log(user);
    return this.http.put(environment.unirJugador, user, {responseType: 'text', observe: 'response'})
                    .subscribe(
                      (response) => {
                        console.log(response.status);
                          this.router.navigateByUrl('/game/:id');
                      },
                      (error) => {
                        console.log(error);
                      }
                    );
  }
 }
