import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckCiteService {

  constructor(private http:HttpClient) { }

  url:string = "http://localhost:8080/checkCite";

  validate(date: string, time: string): Observable<ValidationErrors | null> {
    //Comprobamos que esten ambos campos
    if (!date || !time) {
      return of(null);
    }

    //Lanzamos una peticion a la api con los campos correspondientes
    return this.http.get<any[]>(`${this.url}?date=${date}&time=${time + ":00"}`)
    .pipe(
      map(resp => {
        console.log(resp)
        return resp.length > 0 ? {existCite : true} : null  //Comprobamos si la api nos da una respuesta valida
      }),
      catchError(err => {
        return of(null)
      })
    )
  }
}
