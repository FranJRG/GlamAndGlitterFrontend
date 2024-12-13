import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmployeeSchedule } from '../../interfaces/EmployeeSchedule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http:HttpClient) { }

  //url:string = "https://glamandglitter.onrender.com";
  url:string = "http://localhost:8080";

  getWorkerSchedule(id:number):Observable<EmployeeSchedule[]>{
    return this.http.get<EmployeeSchedule[]>(`${this.url}/userSchedule/${id}`);
  }

  updateSchedule(id:number,day:string, turn:string, userId?:number):Observable<EmployeeSchedule>{
    const params = new HttpParams().set("day",day).set("turn",turn).set("userId",userId as number); //Parámetros necesarios
    return this.http.put<EmployeeSchedule>(`${this.url}/updateSchedule/${id}`,null, {params});
  }

}