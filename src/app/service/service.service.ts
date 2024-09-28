import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Services } from '../interfaces/services';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }
  url:string = "http://localhost:8080/services";
  urlCategory:string = "http://localhost:8080/categories"
  urlRandom:string = "http://localhost:8080/randomServices";
  urlServicesCategory:string = "http://localhost:8080/servicesByCategory";

  getServices():Observable<Services[]>{
    return this.http.get<Services[]>(this.url);
  }

  getRandomServices():Observable<Services[]>{
    return this.http.get<Services[]>(this.urlRandom);
  }

  getServicesByCategory(idCategory:string):Observable<Services[]>{
    return this.http.get<Services[]>(`${this.urlServicesCategory}/${idCategory}`);
  }

  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(this.urlCategory);
  }
}
