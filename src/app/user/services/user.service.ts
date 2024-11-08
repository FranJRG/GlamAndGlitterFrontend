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

  url:string = "https://glamandglitter.onrender.com";

  /**
   * Método para obtener un usuario por su id
   * @param id 
   * @returns 
   */
  getUserById(id:number):Observable<User>{
    return this.http.get<User>(`${this.url}/user/${id}`);
  }

  /**
   * Método para obtener los trabajadores que no tienen horario de trabajo
   * @returns 
   */
  findByUserWithoutSchedule():Observable<User[]>{
    return this.http.get<User[]>(`${this.url}/userWithoutSchedule`);
  }

  /**
   * Método para establecer un horario a un trabajador
   * @param id 
   * @param day 
   * @param turn 
   * @returns 
   */  
  setSchedule(id:number, day:string, turn:string):Observable<EmployeeSchedule[]>{
    const params = new HttpParams().set("day",day).set("turn",turn); //Parámetros necesarios
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

  /**
   * Método para manegar las notificaciones que queremos recibir de la app
   * @param emailNotifications 
   * @param calendarNotifications 
   * @returns 
   */
  manageNotifications(emailNotifications:boolean,calendarNotifications:boolean):Observable<any>{
    const params = new HttpParams() //Parámetros necesarios para la api
        .set("emailNotifications", emailNotifications)
        .set("calendarNotifications", calendarNotifications);

    return this.http.post<any>(`${this.url}/activateNotifications`,null, { params });
  }

}
