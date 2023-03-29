import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import {User} from "../user";
import {AuthService} from "../../auth.service";


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit{
  form: FormGroup; // Store the form
  loading = false; // If form send but not done
  submitted = false; // If form is sent
  email: string; // Store the email
  password: string; // Store password
  verif_password: string; // Store the 2nd check of password
  user : User;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private authService : AuthService
  ) {}

  ngOnInit() {
    /// Init the form with validators
    this.form = new FormGroup({
      email: new FormControl(this.email, [
        Validators.required,
        Validators.minLength(4)
      ]),
      password: new FormControl(this.password, [
      Validators.required,
      Validators.minLength(6)
    ]),
      verif_password: new FormControl(this.verif_password, [
      Validators.required,
      Validators.minLength(6)
    ]),
  }/*, CustomValidators.MatchValidator('password', 'verif_password')*/);
  }

  /*get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      (this.form.get('verif_password')?.touched || this.form.get('password')?.touched)
    );
  }*/

  onSubmit(){
    console.log(this.email);
    console.log(this.password);
    this.user = new User(this.email, this.password);
    // Signup
    this.authService.signup(this.user);

  }/*
  onSubmit() {
    if (this.p1 === this.p2) {
      // Hacer algo si los campos son iguales
    } else {
      // Hacer algo si los campos son diferentes
    }
  }*/
}
/*
// Class with all custom validators for forms
export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? {mismatch: true}
        : null;
    };
  }
}
*/