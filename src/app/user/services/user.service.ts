import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user';
import { EmployeeSchedule } from '../../interfaces/EmployeeSchedule';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  url:string = "http://localhost:8080";

  getUserById(id:number):Observable<User>{
    return this.http.get<User>(`${this.url}/user/${id}`);
  }

  findByUserWithoutSchedule():Observable<User[]>{
    return this.http.get<User[]>(`${this.url}/userWithoutSchedule`);
  }

  setSchedule(id:number, day:string, turn:string):Observable<EmployeeSchedule[]>{
    const params = new HttpParams().set("day",day).set("turn",turn);
    return this.http.post<any>(`${this.url}/setSchedule/${id}`,null,{params});
  }
   
  /**
   * Método para enviar el mensaje de olvido de contraseña
   * @param email 
   * @returns 
   */
  forgotPassword(email:string):Observable<any>{
    const params = new HttpParams().set("email",email);
    return this.http.post<any>(`${this.url}/forgotPassword`,null,{params});
  }

  /**
   * Método para verificar el código enviado al correo
   * @param email 
   * @param code 
   * @returns 
   */
  verifyCode(email:string,code:string):Observable<any>{
    const params = new HttpParams().set("email",email).set("codeToCheck",code);
    return this.http.post<any>(`${this.url}/verifyCode`,null,{params});
  }

  /**
   * Método para cambiar las contraseñas
   * @param email 
   * @param password 
   * @returns 
   */
  changePassword(email:string,password:string):Observable<any>{
    const params = new HttpParams().set("email",email).set("password",password);
    return this.http.post<any>(`${this.url}/changePassword`, null, {params});
  }

  manageNotifications(emailNotifications:boolean,calendarNotifications:boolean):Observable<any>{
    const params = new HttpParams()
        .set("emailNotifications", emailNotifications)
        .set("calendarNotifications", calendarNotifications);

    return this.http.post<any>(`${this.url}/activateNotifications`,null, { params });
  }

}
