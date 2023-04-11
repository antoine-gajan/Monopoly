import {Component, OnInit} from '@angular/core';
import { UserService } from '../user.service';
import { AppRoutingModule } from 'app/app-routing.module';
import { Router } from '@angular/router';
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as yup from 'yup';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  form: FormGroup;

  constructor(private fb: FormBuilder,public userService: UserService) {
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
    if (this.form.valid) {
      //console.log(this.form.value.username, this.form.value.email, this.form.value.password, this.form.value.confirm_password);
      const user = {username: this.form.value.username, email: this.form.value.email, password: this.form.value.password, confirm_password: this.form.value.confirm_password};
      console.log(user);
      this.userService.registro(user);
    }
    else {
      console.log("Valores mal introducidos");
    }
  }

}
