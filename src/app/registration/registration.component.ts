import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
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
      birthday: new FormControl(this.password, [
      Validators.required
    ])
  });
  }

  onSubmit(){
    /// Submit the form
  }
}
