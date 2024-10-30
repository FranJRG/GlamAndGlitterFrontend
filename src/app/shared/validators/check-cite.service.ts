import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Injectable({
  providedIn: 'root'
})
export class CheckCiteService {

  constructor(private http:HttpClient) { }

  url:string = "http://localhost:8080/checkCite";

  /**
   * Validador para comprobar si las fechas y horarios de una cita son válidos
   * @param date 
   * @param time 
   * @param endTime 
   * @returns 
   */
  validate(date: string, time: string, endTime: string): Observable<ValidationErrors | null> {
    //So no le pasamos uno de los 2 campos devolvemos null
    if (!date || !time) {
      return of(null);
    }

    //Lanzamos una peticion a la api con los campos correspondientes
    return this.http.get<any[]>(`${this.url}?date=${date}&time=${time + ":00"}&endTime=${endTime}:00`) //Convertimos la hora en formato HH:mm:ss
    .pipe(
      map(resp => {
        //Si obtenemos respuesta marcamos un error
        return resp.length > 0 ? {existCite : true} : null 
      }),
      //En caso de error mostramos el mensaje correspondiente
      catchError(err => {
        Toastify({
          text: 'Something go bad: ' + err.error.message,
          duration: 4000,
          gravity: 'bottom',
          position: 'center',
          backgroundColor: 'linear-gradient(to right, #FF4C4C, #FF0000)',
        }).showToast()
        return of(null)
      })
    )
  }
}
