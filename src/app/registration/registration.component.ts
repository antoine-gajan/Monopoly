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
  //p1: string | undefined;
  //p2: string | undefined;
  
  form!: FormGroup; // Store the form
  loading = false; // If form send but not done
  submitted = false; // If form is sent
  username: string | undefined;
  password: string | undefined;
  verif_password: string | undefined;

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

  });
  }

  onSubmit(){
    /// Submit the form
  }/*
  onSubmit() {
    if (this.p1 === this.p2) {
      // Hacer algo si los campos son iguales
    } else {
      // Hacer algo si los campos son diferentes
    }
  }*/
}
