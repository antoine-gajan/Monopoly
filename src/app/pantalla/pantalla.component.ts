import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent {

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  form!: FormGroup; // Store the form
  loading = false; // If form send but not done
  submitted = false; // If form is sent
  nombre_jugador: string | undefined;
  /*form!: FormGroup; // Store the form
  loading = false; // If form send but not done
  submitted = false; // If form is sent
  username: string | undefined;
  password: string | undefined;
  

  ngOnInit() {
    /// Init the form with validators
    this.form = new FormGroup({
    username: new FormControl(this.username, [
      Validators.required,
      Validators.minLength(4),
      Validators.email
    ]),
      password: new FormControl(this.password, [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  }

  onSubmit(){
  }*/

}
