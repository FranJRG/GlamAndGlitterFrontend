import { Component, Input, OnInit } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { EmployeeSchedule } from '../../interfaces/EmployeeSchedule';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-worker-schedule',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './worker-schedule.component.html',
  styleUrl: './worker-schedule.component.css'
})
export class WorkerScheduleComponent implements OnInit{

  schedules:EmployeeSchedule[] = [];
  daysOfWeek:any[] = ['Monday','Tuesday','Wednesday','Thursday','Friday']
  @Input()id = 0;

  updateSchedule:any[] = [];

  constructor(private scheduleService:ScheduleService){}

  ngOnInit(): void {
    this.getWorkerSchedule();
  }

  getWorkerSchedule(){
    this.scheduleService.getWorkerSchedule(this.id).subscribe({
      next : (data) => {
        this.schedules = data
      },
      error : (err) =>
        Toastify({
          text: 'Something go bad obtaining the workers ' + err.error.message,
          duration: 3000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast(),
    })
  }

  setSchedule(day:string,event:Event,id?:number){
    let turn = (event.target as HTMLSelectElement).value;
    let employeeSchedule:EmployeeSchedule = {
      "id":id != undefined && id != 0 ? id : 0,
      "day":day,
      "turn":turn
    }
    this.updateSchedule.push(employeeSchedule)
    console.log(employeeSchedule)
  }

  removeChanges(){
    this.updateSchedule = [];
  }

  getTurnsForDay(day: string): EmployeeSchedule[] {
    return this.schedules.filter(schedule => schedule.day === day);
  }

  hasTurnForDay(day: string): boolean {
    return this.schedules.some(schedule => schedule.day === day);
  }

  updateWorkerSchedule() {
    if (this.updateSchedule.length > 0) {
      //Comprobamos la cantidad de cambios que queremos hacer
      let pendingUpdates = this.updateSchedule.length;
  
      this.updateSchedule.forEach((schedule: EmployeeSchedule) => {
        this.scheduleService.updateSchedule(schedule.id, schedule.day, schedule.turn, this.id).subscribe({
          next: () => {
            // Mostrar mensaje de éxito
            Toastify({
              text: `Schedule for ${schedule.day} updated successfully to ${schedule.turn}`,
              duration: 3000,
              gravity: 'bottom',
              position: 'center',
              backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
            }).showToast();
  
            // Reducir el número de actualizaciones pendientes una vez completado y cuando llegue a 0 refrescamos la lista
            pendingUpdates--;
            if (pendingUpdates === 0) {
              this.getWorkerSchedule(); // Actualiza los datos desde el servidor
            }
          },
          error: (err) => {
            Toastify({
              text: 'Something went wrong: ' + err.error.message,
              duration: 3000,
              gravity: 'bottom',
              position: 'center',
              backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
            }).showToast();
          },
        });
      });
  
      // Limpiar los cambios pendientes
      this.updateSchedule = [];
    } else {
      Toastify({
        text: 'No changes have been committed',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #FF4C4C,rgb(203, 93, 14))',
      }).showToast();
    }
  }  

}