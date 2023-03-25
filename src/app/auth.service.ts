import { Injectable } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn : boolean;

  constructor(private http : HttpClientModule) { }

  login() : boolean{
    return true;
  }

  logout() : boolean{
    return true;
  }
}
