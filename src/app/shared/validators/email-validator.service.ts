import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService implements AsyncValidator{

  constructor(private http:HttpClient) { }

  url:string = "http://localhost:8080";

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;

    return this.http.get<any[]>(`${this.url}/checkEmail?email=`+email)
    .pipe(
      map(resp => {
        return resp.length === 0 ? null : {existUser : true}
      }),
      catchError(err => {return of(null)})
    )

  }
}
