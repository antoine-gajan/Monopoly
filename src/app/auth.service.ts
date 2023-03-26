import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from 'rxjs';
import {User} from "./user/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn : boolean;

  constructor(private http : HttpClient) { }

  signup(user : User) : Observable<User>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<User>('https://monopoly-inoformatico.azurewebsites.net/users/create', user, httpOptions).pipe(
      tap((response) => this.log(response)),
      catchError((error) => this.handleError(error, null))
    );
  }
  login() : boolean{
    return true;
  }

  logout() : void{
    // Disconnection
    this.isLoggedIn = false;
  }

  private log(response: any) {
    console.table(response);
  }

  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }
}
