import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent implements OnInit{
  form!: FormGroup; // Store the form
  loading = false; // If form send but not done
  submitted = false; // If form is sent
  username: string | undefined;
  password: string | undefined;
  verif_password: string | undefined;
  birthday: Date | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    /// Init the form with validators
    this.form = new FormGroup({
      username: new FormControl(this.username, [
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
      birthday: new FormControl(this.birthday, [
      Validators.required
    ])
  }, [CustomValidators.MatchValidator('password', 'verif_password')]);
  }

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('verif_password')?.dirty
    );
  }

  onSubmit(){
    /// Submit the form
  }
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }
}
