import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameService} from "../../game/game.service";
import {CartaSuerte, Coordenadas, Propriety, RandomCard} from "../../game/response-type";
import { WebSocketService } from 'app/web-socket.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit{
  is_timer_active: boolean = false;
  remaining_time: number = 0;
  timer: any;
  @Output() leave_game = new EventEmitter();
  @Output() close_card = new EventEmitter();
  @Output() reStartTimerExpulsarJugador = new EventEmitter();
  @Output() reStartTimerExpulsarJugadorAlert = new EventEmitter();

  
  ngOnInit() {
   this.startTimer(10);
  }

  startTimer(time_limit_1: number) {
    console.log("=== START TIMER ALERT ===");
    // If no active timer, create one
    if (!this.is_timer_active) {
      // Set timer as active
      this.is_timer_active = true;
      this.remaining_time = time_limit_1;
      // Time limit in seconds
      const time_limit = time_limit_1;
      // calculate the turn end time in milliseconds
      const end_time = Date.now() + time_limit * 1000;
      this.timer = setInterval(() => {
        // Calculate remaining time in seconds
        this.remaining_time = Math.floor((end_time - Date.now()) / 1000);
        // Check if the timer has finished
        if (this.remaining_time == 0) {
          console.log("15 SECONDS WAITED");
          this.abandonar_partida();
          } 
      }, 1000);
    }
  }

  seguir_jugando(){
    this.is_timer_active = false;
    this.reStartTimerExpulsarJugador.emit();
    this.close_card.emit();
  }

  abandonar_partida(){
    this.is_timer_active = false;
    clearInterval(this.timer);
    console.log("lo expulsamos de la partida, alert");
    this.leave_game.emit();
  }
}
