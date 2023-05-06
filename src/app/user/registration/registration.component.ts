import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as yup from 'yup';
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  form: FormGroup;
  passwordShow: boolean = false;
  confirmPasswordShow: boolean = false;

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
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
    // If user is already logged in, redirect to home
    if (this.userService.getUsername()) {
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

  /*registro(){
    if (this.form.valid) {
      //console.log(this.form.value.username, this.form.value.email, this.form.value.password, this.form.value.confirm_password);
      const user = {username: this.form.value.username, email: this.form.value.email, password: this.form.value.password, confirm_password: this.form.value.confirm_password};
      console.log(user);
      this.userService.registro(user);
    }
    else {
      console.log("Valores mal introducidos");
    }
  }*/
  registro(){
    if (this.form.valid) {
      const user = {username: this.form.value.username, email: this.form.value.email, password: this.form.value.password, confirm_password: this.form.value.confirm_password};
      console.log("CREAR CUENTA", user);
      //this.userService.registro(user);
      this.socketService.registro(user);
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
