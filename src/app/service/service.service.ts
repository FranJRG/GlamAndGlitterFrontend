import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Services } from '../interfaces/services';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }
  url:string = "http://localhost:8080/services";

  getServices():Observable<Services[]>{
    return this.http.get<Services[]>(this.url);
  }
}
