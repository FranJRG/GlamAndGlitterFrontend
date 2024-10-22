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

  daysOfWeek: string[] = [ //Array con los dias de la semana laborables
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  evening:boolean = false //Dejaremos un turn por defecto
  keys:string[] = [] //Almacenamos las claves, es decir los dias seleccionados

  selectedDays: string[] = [];
  stylistSchedule = new Map<string,string>();

  setKey(){
    let turn = "";
    if(!this.evening){ //Cambiamos el turno en funcion de la seleccion del turno que estemos
      turn = "Morning"
    }else{
      turn = "evening"
    }
    this.keys.forEach((key)=>{
      this.stylistSchedule.set(key,turn); //Por cada key que hayamos almacenado le asignamos el turno (Morning o Evening)
    });
  }

  /**
   * Funcion para rellenar el color de los dias y añadirlos al mapa
   * @param day 
   */
  toggleDaySelection(day: string) { 
    const index = this.selectedDays.indexOf(day); //Obtenemos si el dia se encuentra o no en el array
    if (index === -1) {
      this.selectedDays.push(day); // Si el día no está seleccionado, lo agregamos a la lista
      this.keys.push(day); // También lo agregamos a la lista de claves
    } else {
      this.selectedDays.splice(index, 1); // Si el día ya está seleccionado, lo quitamos de la lista
      this.keys.splice(this.keys.indexOf(day), 1); // Y también lo eliminamos de la lista de claves
      this.stylistSchedule.delete(day); // Lo qutiamos del mapa de horario
    }

    // Actualizamos el mapa con los días seleccionados y el turno
    this.setKey();
    console.log(this.stylistSchedule);
  }

  createSchedule(){
    this.evening = true;
    this.stylistSchedule.clear();
    this.selectedDays = [];
    this.keys = [];
    console.log(this.stylistSchedule);
  }
}
