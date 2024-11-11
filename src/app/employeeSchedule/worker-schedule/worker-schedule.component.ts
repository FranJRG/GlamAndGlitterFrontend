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
      "id":id != undefined ? id : 0,
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

  updateWorkerSchedule(){
    if(this.updateSchedule.length > 0){
      this.updateSchedule.forEach((schedule:EmployeeSchedule) => {
        let turn = schedule.turn;
        let day = schedule.day;
        let idUser = this.id;
        this.scheduleService.updateSchedule(schedule.id,day,turn,this.id).subscribe({
          next : (data) => 
            Toastify({
              text:'Schedule updated succesfully',
              duration: 3000,
              gravity: 'bottom',
              position: 'center',
              backgroundColor: 'linear-gradient(to right, #4CAF50, #2E7D32)',
            }).showToast()
          ,
          error : (err) => 
            Toastify({
              text: 'Something go bad: ' + err.error.message,
              duration: 3000,
              gravity: 'bottom',
              position: 'center',
              backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
            }).showToast(),
        })
        this.getWorkerSchedule();
      })
    }else{
      Toastify({
        text: 'No changes have been commited',
        duration: 3000,
        gravity: 'bottom',
        position: 'center',
        backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
      }).showToast()
    }
  }

}
