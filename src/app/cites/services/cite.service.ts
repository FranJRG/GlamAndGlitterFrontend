import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CiteService {

  constructor(private http:HttpClient) { }

  private url:string = "http://localhost:8080/cites";

}
