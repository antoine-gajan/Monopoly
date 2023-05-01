import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/user/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as yup from 'yup';
import { GameService } from 'app/game/game.service';

@Component({
  selector: 'app-unirse_sala_invitado',
  templateUrl: './unirse_sala_invitado.component.html',
  styleUrls: ['./unirse_sala_invitado.component.css']
})
export class UnirseSalaInvitadoComponent {
  form_unirse_invitado: FormGroup;
  loading: boolean = false;
  jugadoresConectadosPartida: string[];
  numeroJugadoresConectados: number = 0;
  maxJugadores: number;
  mensajeNoPuedeConectarse: boolean = false;
  seguirMostrando: boolean = false;
  finMensaje: boolean = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private gameService: GameService
  ) {
    this.form_unirse_invitado = this.fb.group({
      idPartida: ['', [Validators.required]],
      username: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // If user is already logged in, redirect to home
    //console.log("He llegado al inicio de sesion");
    const schema = yup.object().shape({
      username: yup.string().required(),
      password: yup.string().min(8).max(1000).required()
    });

    this.form_unirse_invitado.valueChanges.subscribe(value => {
      schema.validate(value).catch((err) => {
        console.log(err);
      });
    });
  }
  
  async unirseSalaInvitado(){
    /*console.log("Unirse partida: ", this.username, this.idPartida);
    const datos = {idPartida: this.idPartida, username: this.username};
    this.userService.unirseSalaInvitado(datos);
    */
   this.loading = true;
   console.log("UNIRSE PARTIDA COMO INVITADO: ", this.form_unirse_invitado.value.username, this.form_unirse_invitado.value.idPartida);
   try{
    const datos = { idPartida: this.form_unirse_invitado.value.idPartida };
    console.log("1", datos);

    const response = await this.gameService.get_list_players(this.form_unirse_invitado.value.idPartida).toPromise();
    if (response) {
      this.jugadoresConectadosPartida = response.listaJugadores;
      this.numeroJugadoresConectados = this.jugadoresConectadosPartida.length;
      console.log("CONECTADOS: ", this.numeroJugadoresConectados);
      console.log("2", this.form_unirse_invitado.value.username, this.form_unirse_invitado.value.idPartida, this.numeroJugadoresConectados);
    }

    console.log("3", this.form_unirse_invitado.value.username, this.form_unirse_invitado.value.idPartida, this.numeroJugadoresConectados);
    const numJugadores = await this.userService.getNumJugadores(datos).toPromise();
    if (numJugadores !== undefined) {
      this.maxJugadores = numJugadores;
      console.log("maxPlayers: ", this.maxJugadores);
    } else {
      console.log("Error: numJugadores is undefined");
      return;
    }

    console.log("4", this.numeroJugadoresConectados, this.maxJugadores);
    if (this.numeroJugadoresConectados < this.maxJugadores) {
      console.log("SE PUEDE CONECTAR");
      const datos = { idPartida: this.form_unirse_invitado.value.idPartida, username: this.form_unirse_invitado.value.username };
      await this.userService.unirseSalaEsperar(datos);
    } else {
      console.log("NO SE PUEDE CONECTAR");
      this.mensajeNoPuedeConectarse = true;
    }
    //this.loading = false; // La ejecución de la función ha terminado
    this.finMensaje = true;
  } catch (error) {
    console.error(error);
    //this.loading = false; // La ejecución de la función ha terminado con error
    // Mostrar un mensaje de error al usuario
    this.finMensaje = true;
  }
  }
  volverUnirseSala(){
    console.log("VOLVER A UNIRSE A SALA");
    this.loading=false;
    this.finMensaje=false;
    this.mensajeNoPuedeConectarse=false;
  }
  

}
