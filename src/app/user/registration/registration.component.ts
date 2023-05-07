import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as yup from 'yup';
import { WebSocketService } from 'app/web-socket.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  form: FormGroup;
  passwordShow: boolean = false;
  confirmPasswordShow: boolean = false;
  mostrarError: boolean = false;
  //socketID: string = this.socketService.getSocketID();

  constructor(
    private fb: FormBuilder,
    private socketService: WebSocketService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8),Validators.required]],
      confirm_password: ['', [Validators.required]]
    });
  }

  get username() {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirm_password(){
    return this.form.get('confirm_password');
  }

  ngOnInit() {
    this.mostrarError = false;
    // If user is already logged in, redirect to home
    if (this.socketService.getUsername()) {
      //this.router.navigate(['/pantalla']);
    }
    const schema = yup.object().shape({
      username: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(8).max(1000).required(),
      confirm_password: yup.string().oneOf([yup.ref('password')], 'Las contraseñas no coinciden').required()
    });

    this.form.valueChanges.subscribe(value => {
      schema.validate(value).catch((err) => {
        console.log(err);
      });
    });
  }

  
  registro(){
    this.mostrarError = false; 
    if (this.form.valid) {
      console.log("REGISTRO SOCKET ID");
      const nuevo_password = CryptoJS.SHA512(this.form.value.password).toString();
      const nuevo_confirm_password = CryptoJS.SHA512(this.form.value.confirm_password).toString();
      const user = {
        username: this.form.value.username,
        
        password: nuevo_password,
        confirm_password: nuevo_confirm_password,
        email: this.form.value.email,
        socketId: this.socketService.socketID
      };
      console.log("CREAR CUENTA", user);
      this.socketService.registro(user)
      .then((resgisterResponse: boolean) => {
        this.mostrarError = !resgisterResponse;
      })
      .catch(() => {
        console.log("solucion2");
        this.mostrarError = true;
      });
    }
    else {
      console.log("CREAR CUENTA: Valores mal introducidos");
    }
  }

  passwordMostrarOcultarRegistration(){
    this.passwordShow = !this.passwordShow;
  }
  confirmPasswordMostrarOcultarRegistration(){
    this.confirmPasswordShow = !this.confirmPasswordShow;
  }
  // función que permite volver arriba en la página
  volverArriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}