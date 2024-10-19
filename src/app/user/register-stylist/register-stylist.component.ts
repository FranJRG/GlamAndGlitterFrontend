import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Component({
  selector: 'app-register-stylist',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register-stylist.component.html',
  styleUrl: './register-stylist.component.css',
})
export class RegisterStylistComponent {
  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  turn:string = "";
  keys:string[] = []

  selectedDays: string[] = [];
  stylistSchedule = new Map<string,string>();

  setKey(value:string){
    this.keys.forEach((key)=>{
      this.stylistSchedule.set(key,value);
    });
    console.log(this.stylistSchedule);
  }

  toggleDaySelection(day: string) {
    const index = this.selectedDays.indexOf(day);
    
    if (index === -1) {
      // Si el día no está seleccionado, agrégalo a la lista
      this.selectedDays.push(day);
      // También lo agregamos a la lista de claves
      this.keys.push(day);
    } else {
      // Si el día ya está seleccionado, quítalo de la lista
      this.selectedDays.splice(index, 1);
      // Y también lo eliminamos de la lista de claves
      this.keys.splice(this.keys.indexOf(day), 1);
      this.stylistSchedule.delete(day);
    }

    // Actualizamos el mapa con los días seleccionados y el turno
    this.setKey(this.turn);
  }
}
