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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;

  constructor(private fb: FormBuilder,public userService: UserService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.minLength(8),Validators.required]]
    });
  }
  ngOnInit() {
    // If user is already logged in, redirect to home
    if (this.userService.getUsername()) {
      this.router.navigate(['/pantalla']);
    }
    //console.log("He llegado al inicio de sesion");
    const schema = yup.object().shape({
      username: yup.string().required(),
      password: yup.string().min(8).max(1000).required()
    });

    this.form.valueChanges.subscribe(value => {
      schema.validate(value).catch((err) => {
        console.log(err);
      });
    });
  }

  login(){
    if (this.form.valid) {
      this.userService.setUsername(this.form.value.username);
      //this.router.navigate(['/pantalla', { username: this.username }]);
      console.log(this.form.value.username, this.form.value.password);
      const user = {username: this.form.value.username, password: this.form.value.password};
      console.log(user);
      this.userService.login(user);
    }
    else {
      console.log("Valores mal introducidos");
    }
  }
}
